function makeReadable(str) {
	return str
		.replace('_', ' ')
		.toLowerCase()
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (chr) {
			return chr.toUpperCase()
		})
}

/**
 * Companion instance API class for Shure MXCW.
 * Utilized to track the state of the receiver and seats.
 *
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
export default class MxcwApi {
	/**
	 * Create an instance of a Shure API module.
	 *
	 * @param {instance} instance - the parent instance
	 */
	constructor(instance) {
		this.instance = instance

		this.receiver = {
			//all: '', // G
			//allDelegateMicOff: 'FALSE', // S TRUE
			audioInputSpeaklist: 'UNKNOWN', // G/S OFF|ON
			audioMeterRate: 'UNKNOWN', // G/S 0|100-99999
			//clearRequestList: 'FALSE', // S TRUE
			deviceId: 'UNKNOWN', // G/S 1-31 A-Za-z0-9[-]
			flash: 'UNKNOWN', // G/S OFF|ON
			globalMute: 'UNKNOWN', // G/S OFF|ON
			interruptMode: 'UNKNOWN', // G/S NOT_ALLOWED|HIGHER_PRIORITY|EQUAL_AND_HIGHER_PRIORITY
			loudspeakerVolume: 'UNKNOWN', // G/S 000-036 > -30 - +6 dB
			maxDelegateSpeakers: 'UNKNOWN', // G/S 1-8?
			maxNumRequests: 'UNKNOWN', // G/S 1-50?
			maxTotalSpeakers: 'UNKNOWN', // G/S 1-8
			model: 'UNKNOWN', // G 32 A-Z0-9
			//nextMicOn: 'FALSE', // S TRUE
			operationMode: 'UNKNOWN', // G/S AUTO|MANUAL|FIFO|HANDSFREE
			retainSeatPersistence: 'UNKNOWN', // G/S DISABLED|ENABLED
			rfMeterRate: 'UNKNOWN', // G/S 0|100-99999
			rfPower: 'UNKNOWN', // G/S OFF|LOW|MEDIUM|HIGH|MAXIMUM
			wduLockWelcome: 'UNKNOWN', // G/S DISABLED|ENABLED
			//wduOff: 'FALSE', // S TRUE
			//welcomeLockReset: 'FALSE', // S TRUE
		}
		this.auxInputs = []
		this.auxOutputs = []
		this.danteInputs = []
		this.danteOutputs = []
		this.seats = []
	}

	/**
	 * Returns the desired aux input state object.
	 *
	 * @param {number} id - the aux input to fetch
	 * @returns {Object} the desired aux input object
	 */
	getAuxInput(id) {
		if (this.auxInputs[id] === undefined) {
			this.auxInputs[id] = {
				agc: 'UNKNOWN', // G/S OFF|ON
				gain: 'UNKNOWN', // G/S 000-040 > -30 - +10 dB
				mute: 'UNKNOWN', // G/S OFF|ON
				pad: 'UNKNOWN', // G/S OFF|ON
			}
		}

		return this.auxInputs[id]
	}

	/**
	 * Returns the desired aux output state object.
	 *
	 * @param {number} id - the aux output to fetch
	 * @returns {Object} the desired aux output object
	 */
	getAuxOutput(id) {
		if (this.auxOutputs[id] === undefined) {
			this.auxOutputs[id] = {
				gain: 'UNKNOWN', // G/S 000-030 > -30 - 0 dB
				mute: 'UNKNOWN', // G/S OFF|ON
			}
		}

		return this.auxOutputs[id]
	}

	/**
	 * Returns the desired dante input state object.
	 *
	 * @param {number} id - the dante input to fetch
	 * @returns {Object} the desired dante input object
	 */
	getDanteInput(id) {
		if (this.danteInputs[id] === undefined) {
			this.danteInputs[id] = {
				agc: 'UNKNOWN', // G/S OFF|ON
				gain: 'UNKNOWN', // G/S 000-040 > -30 - +10 dB
				mute: 'UNKNOWN', // G/S OFF|ON
			}
		}

		return this.danteInputs[id]
	}

	/**
	 * Returns the desired dante output state object.
	 *
	 * @param {number} id - the dante output to fetch
	 * @returns {Object} the desired dante output object
	 */
	getDanteOutput(id) {
		if (this.danteOutputs[id] === undefined) {
			this.danteOutputs[id] = {
				gain: 'UNKNOWN', // G/S 000-030 > -30 - 0 dB
				mute: 'UNKNOWN', // G/S OFF|ON
			}
		}

		return this.danteOutputs[id]
	}

	/**
	 * Returns the receiver state object.
	 *
	 * @returns {Object} the receiver state object
	 */
	getReceiver() {
		return this.receiver
	}

	/**
	 * Returns the desired seat state object.
	 *
	 * @param {number} id - the seat to fetch
	 * @returns {Object} the desired seat object
	 */
	getSeat(id) {
		if (this.seats[id] === undefined) {
			this.seats[id] = {
				battCharge: 'UNKNOWN', // G 000-100|UNKNOWN
				battCycle: 'UNKNOWN', // G 0000-9999|UNKNOWN
				battHealth: 'UNKNOWN', // G 000-100|255|UNKNOWN
				battRunTime: 'UNKNOWN', // G 0-65535|UNKNOWN
				exclusiveMute: 'UNKNOWN', // G/S OFF|ON
				flash: 'UNKNOWN', // G/S OFF|ON|UNKNOWN
				micAgc: 'UNKNOWN', // G/S OFF|ON|UNKNOWN
				micGain: 'UNKNOWN', // G/S 000-040 > -30 - +10 dB
				micPriority: 'UNKNOWN', // G/S 1-5
				micStatus: 'UNKNOWN', // G OFF|ON|UNKNOWN
				name: 'UNKNOWN', // G/S 128 bytes, {}<>
				requestListStatus: 'UNKNOWN', // G IN_LIST|NOT_IN_LIST
				role: 'UNKNOWN', // G/S DELEGATE|CHAIRMAN|LISTENER|AMBIENT|REMOTE_CALLER|DUAL_DELEGATE
				rssi: 'UNKNOWN', // R ??
				speakListStatus: 'UNKNOWN', // G IN_LIST|NOT_IN_LIST
				//speakRelease: 'UNKNOWN', // S TRUE
				//speakRequest: 'UNKNOWN', // S TRUE
				unitAvailable: 'UNKNOWN', // G AVAILABLE|OFFLINE|NOT_REGISTERED|UNKNOWN
			}
		}

		return this.seats[id]
	}

	/**
	 * Update a seat property.
	 *
	 * @param {number} id - the seat id
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 */
	updateSeat(id, key, value) {
		let seat = this.getSeat(id)
		let prefix = `seat_${id}_`
		let variable

		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		if (key == 'BATT_CHARGE') {
			seat.batteryCharge = value == 'Unknown' ? 255 : parseInt(value)
			if (seat.batteryCharge == 255) {
				variable = 'Unknown'
			} else {
				variable = value + (this.instance.config.variableFormat == 'units' ? '%' : '')
			}
			this.instance.setVariableValues({ [`${prefix}batt_charge`]: variable })
		} else if (key == 'BATT_CYCLE') {
			seat.batteryCycle = value == 'Unknown' ? 65535 : parseInt(value)
			if (seat.batteryCycle == 65535) {
				variable = 'Unknown'
			} else {
				variable = value
			}
			this.instance.setVariableValues({ [`${prefix}batt_cycle`]: variable })
		} else if (key == 'BATT_HEALTH') {
			seat.batteryHealth = value == 'Unknown' ? 255 : parseInt(value)
			if (seat.batteryHealth == 255) {
				variable = 'Unknown'
			} else {
				variable = value + (this.instance.config.variableFormat == 'units' ? '%' : '')
			}
			this.instance.setVariableValues({ [`${prefix}batt_health`]: variable })
		} else if (key == 'BATT_RUN_TIME') {
			seat.batteryRuntime = value == 'Unknown' ? 65535 : parseInt(value)
			if (seat.batteryRuntime == 65535) {
				variable = 'Unknown'
			} /**else if (seat.batteryRuntime == 65534) {
				variable = 'Calculating'
			} else if (seat.batteryRuntime == 65533) {
				variable = 'Error'
			}**/ else if (this.instance.config.variableFormat == 'numeric') {
				variable = seat.batteryRuntime
			} else {
				let mins = seat.batteryRuntime
				let h = Math.floor(mins / 60)
				let m = mins % 60
				m = m < 10 ? '0' + m : m
				variable = `${h}:${m}`
			}
			this.instance.setVariableValues({ [`${prefix}batt_run_time`]: variable })
		} else if (key == 'EXCLUSIVE_MUTE') {
			seat.exclusiveMute = value
			this.instance.setVariableValues({ [`${prefix}exclusive_mute`]: makeReadable(seat.exclusiveMute) })
			this.instance.checkFeedbacks('exclusive_mute')
		} else if (key == 'FLASH') {
			seat.flash = value
			this.instance.setVariableValues({ [`${prefix}flash`]: makeReadable(seat.flash) })
			this.instance.checkFeedbacks('flash')
		} else if (key == 'MIC_AGC') {
			seat.micAgc = value
			this.instance.setVariableValues({ [`${prefix}mic_agc`]: makeReadable(seat.micAgc) })
			this.instance.checkFeedbacks('mic_agc')
		} else if (key == 'MIC_GAIN') {
			seat.micGain = parseInt(value) - 30
			variable =
				this.instance.config.variableFormat == 'units'
					? (seat.micGain > 0 ? '+' : '') + seat.micGain.toString() + ' dB'
					: seat.micGain
			this.instance.setVariableValues({ [`${prefix}mic_gain`]: variable })
			this.instance.checkFeedbacks('mic_gain')
		} else if (key == 'MIC_PRIORITY') {
			seat.micPriority = parseInt(value)
			this.instance.setVariableValues({ [`${prefix}mic_priority`]: seat.micPriority })
			this.instance.checkFeedbacks('mic_priority')
		} else if (key == 'MIC_STATUS') {
			seat.micStatus = value
			this.instance.setVariableValues({ [`${prefix}mic_status`]: makeReadable(seat.micStatus) })
			this.instance.checkFeedbacks('mic_status')
		} else if (key == 'REQUEST_LIST_STATUS') {
			seat.requestListStatus = value
			this.instance.setVariableValues({ [`${prefix}request_list_status`]: makeReadable(seat.requestListStatus) })
			this.instance.checkFeedbacks('request_list_status')
		} else if (key == 'ROLE') {
			seat.role = value
			this.instance.setVariableValues({ [`${prefix}role`]: makeReadable(seat.role) })
			this.instance.checkFeedbacks('role')
		} else if (key == 'RSSI') {
			seat.rssi = parseInt(value) - 120 // -120 offset is assumed
			variable = this.instance.config.variableFormat == 'units' ? seat.rssi.toString() + ' dBM' : seat.rssi
			this.instance.setVariableValues({ [`${prefix}rssi`]: variable })
		} else if (key == 'SEAT_NAME') {
			seat.name = value.replace('{', '').replace('}', '').trim()
			this.instance.setVariableValues({ [`${prefix}name`]: seat.name })
			this.instance.updateActions()
			this.instance.updateFeedbacks()
		} else if (key == 'SPEAK_LIST_STATUS') {
			seat.speakListStatus = value
			this.instance.setVariableValues({ [`${prefix}speak_list_status`]: makeReadable(seat.speakListStatus) })
			this.instance.checkFeedbacks('speak_list_status')
		} else if (key == 'UNIT_AVAILABLE') {
			seat.unitAvailable = value
			this.instance.setVariableValues({ [`${prefix}unit_available`]: makeReadable(seat.unitAvailable) })
			this.instance.checkFeedbacks('unit_available')
		}
	}

	/**
	 * Update a receiver property.
	 *
	 * @param {String} type - aux/dante
	 * @param {String} direction - input/output
	 * @param {number} id - the IO id
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 */
	updateReceiver(type, direction, id, key, value) {
		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		let obj, varKey

		if (type == 'aux' && direction == 'input') {
			obj = this.getAuxInput(id)
			varKey = 'aux_input'
		} else if (type == 'aux' && direction == 'output') {
			obj = this.getAuxOutput(id)
			varKey = 'aux_output'
		} else if (type == 'dante' && direction == 'input') {
			obj = this.getDanteInput(id)
			varKey = 'dante_input'
		} else if (type == 'dante' && direction == 'output') {
			obj = this.getDanteOutput(id)
			varKey = 'dante_output'
		}

		if (key.match(/AGC/)) {
			obj.agc = value
			this.instance.setVariableValues({ [`${varKey}_agc`]: makeReadable(obj.agc) })
			this.instance.checkFeedbacks(`${varKey}_agc`)
		} else if (key.match(/GAIN/)) {
			obj.gain = parseInt(value) - 30
			this.instance.setVariableValues({
				[`${varKey}_gain`]:
					this.instance.config.variableFormat == 'units'
						? (obj.gain > 0 ? '+' : '') + obj.gain.toString() + ' dB'
						: obj.gain,
			})
			this.instance.checkFeedbacks(`${varKey}_gain`)
		} else if (key.match(/MUTE/)) {
			obj.mute = value
			this.instance.setVariableValues({ [`${varKey}_mute`]: makeReadable(obj.mute) })
			this.instance.checkFeedbacks(`${varKey}_mute`)
		} else if (key.match(/PAD/)) {
			obj.pad = value
			this.instance.setVariableValues({ [`${varKey}_pad`]: makeReadable(obj.pad) })
			this.instance.checkFeedbacks(`${varKey}_pad`)
		}
	}

	/**
	 * Update a receiver property.
	 *
	 * @param {String} key - the command id
	 * @param {String} value - the new value
	 */
	updateReceiver(key, value) {
		let variable

		if (value == 'UNKN' || value == 'UNKNOWN') {
			value = 'Unknown'
		}

		if (key == 'AUDIO_INPUT_SPEAKLIST') {
			this.receiver.audioInputSpeaklist = value
			this.instance.setVariableValues({ audio_input_speaklist: makeReadable(this.receiver.audioInputSpeaklist) })
			this.instance.checkFeedbacks('audio_input_speaklist')
		} else if (key == 'AUDIO_METER_RATE') {
			this.receiver.audioMeterRate = parseInt(value)
			if (this.receiver.audioMeterRate == 0) {
				variable = 'Disabled'
			} else {
				variable = this.receiver.audioMeterRate + (this.instance.config.variableFormat == 'units' ? ' ms' : '')
			}
			this.instance.setVariableValues({ audio_meter_rate: variable })
		} else if (key == 'DEVICE_ID') {
			this.receiver.deviceId = value.replace('{', '').replace('}', '').trim()
			this.instance.setVariableValues({ device_id: this.receiver.deviceId })
		} else if (key == 'FLASH') {
			this.receiver.flash = value
			this.instance.setVariableValues({ flash: makeReadable(this.receiver.flash) })
			this.instance.checkFeedbacks('flash')
		} else if (key == 'GLOBAL_MUTE') {
			this.receiver.globalMute = value
			this.instance.setVariableValues({ global_mute: makeReadable(this.receiver.globalMute) })
			this.instance.checkFeedbacks('global_mute')
		} else if (key == 'INTERRUPT_MODE') {
			this.receiver.interruptMode = value
			this.instance.setVariableValues({ interrupt_mode: makeReadable(this.receiver.interruptMode) })
			this.instance.checkFeedbacks('interrupt_mode')
		} else if (key == 'LOUDSPEAKER_VOLUME') {
			this.receiver.loudspeakerVolume = parseInt(value) - 30
			this.instance.setVariableValues({
				loudspeaker_volume:
					this.instance.config.variableFormat == 'units'
						? (this.receiver.loudspeakerVolume > 0 ? '+' : '') + this.receiver.loudspeakerVolume.toString() + ' dB'
						: this.receiver.loudspeakerVolume,
			})
			this.instance.checkFeedbacks('loudspeaker_volume')
		} else if (key == 'MAX_DELEGATE_SPEAKERS') {
			this.receiver.maxDelegateSpeakers = parseInt(value)
			this.instance.setVariableValues({ max_delegate_speakers: this.receiver.maxDelegateSpeakers })
			this.instance.checkFeedbacks('max_delegate_speakers')
		} else if (key == 'MAX_NUM_REQUESTS') {
			this.receiver.maxNumRequests = parseInt(value)
			this.instance.setVariableValues({ max_num_requests: this.receiver.maxNumRequests })
			this.instance.checkFeedbacks('max_num_requests')
		} else if (key == 'MAX_TOTAL_SPEAKERS') {
			this.receiver.maxTotalSpeakers = parseInt(value)
			this.instance.setVariableValues({ max_total_speakers: this.receiver.maxTotalSpeakers })
			this.instance.checkFeedbacks('max_total_speakers')
		} else if (key == 'MODEL') {
			this.receiver.model = value.replace('{', '').replace('}', '').trim()
			this.instance.setVariableValues({ model: this.receiver.model })
		} else if (key == 'OPERATION_MODE') {
			this.receiver.operationMode = value
			this.instance.setVariableValues({ operation_mode: makeReadable(this.receiver.operationMode) })
			this.instance.checkFeedbacks('operation_mode')
		} else if (key == 'RETAIN_SEAT_PERSISTENCE') {
			this.receiver.retainSeatPersistence = value
			this.instance.setVariableValues({ retain_seat_persistence: makeReadable(this.receiver.retainSeatPersistence) })
			this.instance.checkFeedbacks('retain_seat_persistence')
		} else if (key == 'RF_METER_RATE') {
			this.receiver.rfMeterRate = parseInt(value)
			if (this.receiver.rfMeterRate == 0) {
				variable = 'Disabled'
			} else {
				variable = this.receiver.rfMeterRate + (this.instance.config.variableFormat == 'units' ? ' ms' : '')
			}
			this.instance.setVariableValues({ rf_meter_rate: variable })
		} else if (key == 'RF_POWER') {
			this.receiver.rfPower = value
			this.instance.setVariableValues({ rf_power: makeReadable(this.receiver.rfPower) })
			this.instance.checkFeedbacks('rf_power')
		} else if (key == 'WDU_LOCK_WELCOME') {
			this.receiver.wduLockWelcome = value
			this.instance.setVariableValues({ wdu_lock_welcome: makeReadable(this.receiver.wduLockWelcome) })
			this.instance.checkFeedbacks('wdu_lock_welcome')
		}
	}
}
