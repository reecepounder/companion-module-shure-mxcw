import { InstanceBase, Regex, runEntrypoint, TCPHelper } from '@companion-module/base'
import { updateActions } from './actions.js'
import { updateFeedbacks } from './feedback.js'
import { updateVariables } from './variables.js'
import MxcwApi from './internalAPI.js'
import { iterate, parse } from 'multi-integer-range'

/**
 * Companion instance class for the Shure MXCW.
 *
 * @extends InstanceBase
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class ShureMxcwInstance extends InstanceBase {
	/**
	 * Create an instance of a shure WX module.
	 *
	 * @param {Object} internal - Companion internals
	 */
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		this.updateFeedbacks = updateFeedbacks.bind(this)
		this.updateVariables = updateVariables.bind(this)
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 */
	async configUpdated(config) {
		let resetConnection = false
		let cmd

		if (this.config.host != config.host) {
			resetConnection = true
		}

		if (config.meteringOn === true) {
			cmd = `< SET AUDIO_METER_RATE ${config.meteringInterval} >< SET RF_METER_RATE ${config.meteringInterval} >`
		} else {
			cmd = '< SET AUDIO_METER_RATE 0 >< SET RF_METER_RATE 0 >'
		}

		this.config = config

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		} else if (cmd !== undefined) {
			this.socket.send(cmd)
		}
	}

	/**
	 * Clean up the instance before it is destroyed.
	 */
	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		this.log('debug', 'destroy', this.id)
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 */
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 2,
				regex: Regex.PORT,
			},
			{
				type: 'checkbox',
				id: 'meteringOn',
				label: 'Enable Metering?',
				width: 2,
				default: true,
			},
			{
				type: 'textinput',
				id: 'range',
				label: 'Seat Numbers to Control',
				tooltip: 'Enter a range and/or comma separated numbers, e.g.: 1-30, 40, 50-59.  Valid seats are 1-65535',
				width: 4,
				default: '1-50',
				required: true,
				regex: '/^([0-9]+(-[0-9]+)?)(,([0-9]+(-[0-9]+)?))*$/',
			},
			{
				type: 'number',
				id: 'meteringInterval',
				label: 'Metering Interval (in ms)',
				width: 4,
				min: 500,
				max: 99999,
				default: 5000,
				required: true,
			},
			{
				type: 'dropdown',
				id: 'variableFormat',
				label: 'Variable Format',
				choices: [
					{ id: 'units', label: 'Include Units' },
					{ id: 'numeric', label: 'Numeric Only' },
				],
				width: 6,
				default: 'units',
				tooltip:
					'Changing this setting will apply to new values received.  To refresh all variables with the new setting, disable and re-enable the connection after saving these settings.',
			},
		]
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @param {Object} config - the configuration
	 */
	async init(config) {
		this.config = config
		this.deviceName = ''
		this.initDone = false

		this.heartbeatInterval = null
		this.heartbeatTimeout = null

		this.CHOICES_SEATS = []
		this.CHOICES_SEATS_A = []

		if (this.config.variableFormat === undefined) {
			this.config.variableFormat = 'units'
		}

		this.updateStatus('disconnected', 'Connecting')

		this.api = new MxcwApi(this)

		this.setupFields()

		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 */
	initTCP() {
		this.receiveBuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		if (this.config.port === undefined) {
			this.config.port = 2202
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.log('error', `Network error: ${err.message}`)
			})

			this.socket.on('connect', () => {
				this.log('debug', 'Connected')
				let cmd = '< GET ALL >'
				this.socket.send(cmd)

				if (this.config.meteringOn === true) {
					cmd = `< SET AUDIO_METER_RATE ${this.config.meteringInterval} >`
					this.socket.send(cmd)
					cmd = `< SET RF_METER_RATE ${this.config.meteringInterval} >`
					this.socket.send(cmd)
				}

				this.heartbeatInterval = setInterval(() => {
					this.socket.send('< GET AUDIO_METER_RATE >')
				}, 30000)
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk

				while ((i = this.receiveBuffer.indexOf('>', offset)) !== -1) {
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				this.receiveBuffer = this.receiveBuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ', '').trim())

				if (line.match(/AUDIO_METER_RATE/)) {
					if (this.heartbeatTimeout !== undefined) {
						clearTimeout(this.heartbeatTimeout)
					}

					this.heartbeatTimeout = setTimeout(this.initTCP.bind(this), 60000)
				}
			})
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} command - the command/data type being passed
	 */
	processShureCommand(command) {
		this.log('debug', `Received: ${command}`)

		if ((typeof command === 'string' || command instanceof String) && command.length > 0) {
			let commandArr = command.split(' ')
			let commandType = commandArr.shift()
			let commandNum = parseInt(commandArr[0])

			let joinData = function (commands, start) {
				let out = ''
				if (commands.length > 0) {
					for (let i = start; i < commands.length; i++) {
						out += commands[i] + ' '
					}
				}
				return out.trim()
			}

			if (commandType == 'REP') {
				//this is a report command

				if (isNaN(commandNum)) {
					//this command isn't about a specific seat
					this.api.updateReceiver(commandArr[0], joinData(commandArr, 1))
				} else if (commandArr[1].match(/AUX_INPUT/)) {
					this.api.updateFixedIO('aux', 'input', commandNum, commandArr[1], joinData(commandArr, 2))
				} else if (commandArr[1].match(/AUX_OUTPUT/)) {
					this.api.updateFixedIO('aux', 'output', commandNum, commandArr[1], joinData(commandArr, 2))
				} else if (commandArr[1].match(/DANTE_INPUT/)) {
					this.api.updateFixedIO('dante', 'input', commandNum, commandArr[1], joinData(commandArr, 2))
				} else if (commandArr[1].match(/DANTE_OUTPUT/)) {
					this.api.updateFixedIO('dante', 'output', commandNum, commandArr[1], joinData(commandArr, 2))
				} else {
					//this command is about a specific seat
					this.api.updateSeat(commandNum, commandArr[1], joinData(commandArr, 2))
				}
			} else if (commandType == 'AUDIO_SAMPLE') {
				//this is a sample command
				//this.api.parseADSample(commandNum, command)
				//this.checkFeedbacks('sample')
			}
		}
	}

	/**
	 * INTERNAL: send a command to the receiver.
	 */
	sendCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('debug', `Sending: ${cmd}`)
				this.socket.send(`< ${cmd} >`)
			} else {
				this.log('debug', `Socket not connected: ${cmd}`)
			}
		}
	}

	/**
	 * Set up the fields used in actions and feedbacks
	 */
	setupFields() {
		this.SEATS_FIELD = {
			type: 'dropdown',
			label: 'Seat',
			id: 'seat',
			default: '1',
			choices: this.CHOICES_SEATS,
		}
		this.SEATS_A_FIELD = {
			type: 'dropdown',
			label: 'Seat',
			id: 'seat',
			default: '1',
			choices: this.CHOICES_SEATS_A,
		}
	}

	/**
	 * INTERNAL: use model data to define the seat choicess.
	 */
	setupSeatChoices() {
		this.CHOICES_SEATS = []
		this.CHOICES_SEATS_A = []

		this.CHOICES_SEATS_A.push({ id: 0, label: 'All Seats' })

		for (let i of iterate(parse(this.config.range))) {
			let data = `Seat ${i}`

			if (this.api.getSeat(i).name != '' && this.api.getSeat(i).name != 'UNKNOWN') {
				data += ' (' + this.api.getSeat(i).name + ')'
			}

			this.CHOICES_SEATS.push({ id: i, label: data })
			this.CHOICES_SEATS_A.push({ id: i, label: data })
		}

		this.SEATS_FIELD.choices = this.CHOICES_SEATS
		this.SEATS_A_FIELD.choices = this.CHOICES_SEATS_A
	}
}

runEntrypoint(ShureMxcwInstance, [])
