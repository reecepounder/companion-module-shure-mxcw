import { Fields } from './setup.js'

/**
 * INTERNAL: Set the available actions.
 */
export function updateActions() {
	this.setupSeatChoices()

	this.setActionDefinitions({
		all: {
			name: 'Retrieve all supported commands',
			options: [],
			callback: async () => {
				this.sendCommand(`GET ALL`)
			},
		},
		all_delegate_mic_off: {
			name: 'Turn all delegate microphones off',
			options: [],
			callback: async () => {
				this.sendCommand(`SET ALL_DELEGATE_MIC_OFF TRUE`)
			},
		},
		audio_input_speaklist: {
			name: 'Show audio input speaklist',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET AUDIO_INPUT_SPEAKLIST ${options.choice}`)
			},
		},
		aux_input_agc: {
			name: 'Set aux input AGC',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET 1 AUX_INPUT_AGC ${options.choice}`)
			},
		},
		aux_input_gain: {
			name: 'Set aux input gain',
			options: [Fields.GainSet(10)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET 1 AUX_INPUT_GAIN ${vol}`)
			},
		},
		aux_input_mute: {
			name: 'Set aux input mute',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET 1 AUX_INPUT_MUTE ${options.choice}`)
			},
		},
		aux_input_pad: {
			name: 'Set aux input pad',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET 1 AUX_INPUT_PAD ${options.choice}`)
			},
		},
		aux_output_gain: {
			name: 'Set aux output gain',
			options: [Fields.GainSet(0)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET 1 AUX_OUTPUT_GAIN ${vol}`)
			},
		},
		aux_output_mute: {
			name: 'Set aux output mute',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET 1 AUX_OUTPUT_MUTE ${options.choice}`)
			},
		},
		clear_request_list: {
			name: 'Clear seats from request list',
			options: [],
			callback: async () => {
				this.sendCommand(`SET CLEAR_REQUEST_LIST TRUE`)
			},
		},
		close_voting_results: {
            name: 'Close Voting Results',
            options: [],
            callback: async () => {
                this.sendCommand(`SET CLOSE_VOTING_RESULTS TRUE`)
            },
        },
		complete_vote: {
            name: 'Complete Voting Session',
            options: [],
            callback: async () => {
                this.sendCommand(`SET COMPLETE_VOTE TRUE`)
            },
        },
		dante_input_agc: {
			name: 'Set Dante input AGC',
			options: [Fields.Dante, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.ch} DANTE_INPUT_AGC ${options.choice}`)
			},
		},
		dante_input_gain: {
			name: 'Set Dante input gain',
			options: [Fields.Dante, Fields.GainSet(10)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET ${options.ch} DANTE_INPUT_GAIN ${vol}`)
			},
		},
		dante_input_mute: {
			name: 'Set Dante input mute',
			options: [Fields.Dante, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.ch} DANTE_INPUT_MUTE ${options.choice}`)
			},
		},
		dante_output_gain: {
			name: 'Set Dante output gain',
			options: [Fields.Dante, Fields.GainSet(0)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET ${options.ch} DANTE_OUTPUT_GAIN ${vol}`)
			},
		},
		dante_output_mute: {
			name: 'Set Dante output mute',
			options: [Fields.Dante, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.ch} DANTE_OUTPUT_MUTE ${options.choice}`)
			},
		},
		device_id: {
			name: 'Set device ID',
			options: [Fields.Id],
			callback: async ({ options }) => {
				this.sendCommand(`SET DEVICE_ID {${options.id}}`)
			},
		},
		exclusive_mute: {
			name: 'Assign exclusive mute',
			options: [this.SEATS_FIELD, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} FLASH ${options.choice}`)
			},
		},
		flash_apt: {
			name: 'Turn on flash to identify APT',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET FLASH ${options.choice}`)
			},
		},
		flash_seat: {
			name: 'Turn on flash to identify a seat',
			options: [this.SEATS_A_FIELD, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} FLASH ${options.choice}`)
			},
		},
		global_mute: {
			name: 'Set global mute',
			options: [Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET GLOBAL_MUTE ${options.choice}`)
			},
		},
		interrupt_mode: {
			name: 'Set interruption mode',
			options: [Fields.InterruptMode],
			callback: async ({ options }) => {
				this.sendCommand(`SET INTERRUPT_MODE ${options.choice}`)
			},
		},
		loudspeaker_volume: {
			name: 'Set the volume of loudspeakers for conference units',
			options: [Fields.GainSet(6)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET LOUDSPEAKER_VOLUME ${vol}`)
			},
		},
		max_delegate_speakers: {
			name: 'Set maximum number of delegate speakers',
			options: [Fields.MaxSet(8)],
			callback: async ({ options }) => {
				this.sendCommand(`SET MAX_DELEGATE_SPEAKERS ${options.val}`)
			},
		},
		max_num_requests: {
			name: 'Set maximum number of delegates allowed in request list',
			options: [Fields.MaxSet(50)],
			callback: async ({ options }) => {
				this.sendCommand(`SET MAX_NUM_REQUESTS ${options.val}`)
			},
		},
		max_total_speakers: {
			name: 'Set maximum number of speakers allowed',
			options: [Fields.MaxSet(8)],
			callback: async ({ options }) => {
				this.sendCommand(`SET MAX_TOTAL_SPEAKERS ${options.val}`)
			},
		},
		mic_agc: {
			name: 'Set microphone AGC',
			options: [this.SEATS_A_FIELD, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} MIC_AGC ${options.choice}`)
			},
		},
		mic_gain: {
			name: 'Set the microphone gain of conference unit',
			options: [this.SEATS_A_FIELD, Fields.GainSet(10)],
			callback: async ({ options }) => {
				let vol = 30 + options.gain
				this.sendCommand(`SET ${options.seat} MIC_GAIN ${vol}`)
			},
		},
		mic_priority: {
			name: 'Set microphone priority',
			options: [this.SEATS_A_FIELD, Fields.Priority],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} MIC_PRIORITY ${options.val}`)
			},
		},
		mic_status: {
			name: 'Set microphone status',
			options: [this.SEATS_A_FIELD, Fields.OnOff],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} MIC_STATUS ${options.choice}`)
			},
		},
		next_mic_on: {
			name: 'Turn next microphone in request list on',
			options: [],
			callback: async () => {
				this.sendCommand(`SET NEXT_MIC_ON TRUE`)
			},
		},
		operation_mode: {
			name: 'Set operation mode',
			options: [Fields.OperationMode],
			callback: async ({ options }) => {
				this.sendCommand(`SET OPERATION_MODE ${options.choice}`)
			},
		},
		retain_seat_persistence: {
			name: 'Set retain seat information on reboot',
			options: [Fields.EnabledDisabled],
			callback: async ({ options }) => {
				this.sendCommand(`SET RETAIN_SEAT_PERSISTENCE ${options.choice}`)
			},
		},
		rf_power: {
			name: 'Set RF power',
			options: [Fields.RfPower],
			callback: async ({ options }) => {
				this.sendCommand(`SET RF_POWER ${options.choice}`)
			},
		},
		role: {
			name: 'Set role for device',
			options: [this.SEATS_A_FIELD, Fields.Role],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} ROLE ${options.choice}`)
			},
		},
		seat_name: {
			name: 'Set seat name',
			tooltip: 'UTF-8 characters are allowed except for {,},<,>',
			options: [this.SEATS_A_FIELD, Fields.Name],
			callback: async ({ options }) => {
				this.sendCommand(`SET ${options.seat} SEAT_NAME {${options.id}}`)
			},
		},
		start_vote: {
            name: 'Start Voting',
            options: [
                {
                    type: 'number',
                    label: 'Voting Mode ID', // could improve this by adding a dropdown with the available voting modes - pull from < GET n VOTING_CONFIGURATION_NAME >
                    id: 'voteNumber',
                    min: 0,
                    required: true,
                },
            ],
            callback: async ({ options }) => {
                this.sendCommand(`SET START_VOTE ${options.voteNumber}`)
            },
        },
		wdu_lock_welcome: {
			name: 'Set welcome screen lock status',
			options: [Fields.EnabledDisabled],
			callback: async ({ options }) => {
				this.sendCommand(`SET WDU_LOCK_WELCOME ${options.choice}`)
			},
		},
		wdu_off: {
			name: 'Turn conference unit off',
			options: [],
			callback: async () => {
				this.sendCommand(`SET WDU_OFF TRUE`)
			},
		},
		welcome_lock_reset: {
			name: 'Reset welcome screen lock to default',
			options: [],
			callback: async () => {
				this.sendCommand(`SET WELCOME_LOCK_RESET TRUE`)
			},
		},
	})
}
