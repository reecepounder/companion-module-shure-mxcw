import { combineRgb } from '@companion-module/base'
import { Fields } from './setup.js'

/**
 * INTERNAL: initialize feedbacks.
 */
export function updateFeedbacks() {
	this.setFeedbackDefinitions({
		audio_input_speaklist: {
			type: 'boolean',
			name: 'Check audio input speaklist',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().audioInputSpeaklist == options.choice
			},
		},
		aux_input_agc: {
			type: 'boolean',
			name: 'Check aux input AGC',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxInput(1).agc == options.choice
			},
		},
		aux_input_gain: {
			type: 'boolean',
			name: 'Check aux input gain',
			options: [Fields.GainSet(10)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxInput(1).gain == options.gain
			},
		},
		aux_input_mute: {
			type: 'boolean',
			name: 'Check aux input mute',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxInput(1).mute == options.choice
			},
		},
		aux_input_pad: {
			type: 'boolean',
			name: 'Check aux input pad',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxInput(1).pad == options.choice
			},
		},
		aux_output_gain: {
			type: 'boolean',
			name: 'Check aux output gain',
			options: [Fields.GainSet(0)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxOutput(1).gain == options.gain
			},
		},
		aux_output_mute: {
			type: 'boolean',
			name: 'Check aux output mute',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getAuxOutput(1).mute == options.choice
			},
		},
		dante_input_agc: {
			type: 'boolean',
			name: 'Check Dante input AGC',
			options: [Fields.Dante, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getDanteInput(options.ch).agc == options.choice
			},
		},
		dante_input_gain: {
			type: 'boolean',
			name: 'Check Dante input gain',
			options: [Fields.Dante, Fields.GainSet(10)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getDanteInput(options.ch).gain == options.gain
			},
		},
		dante_input_mute: {
			type: 'boolean',
			name: 'Check Dante input mute',
			options: [Fields.Dante, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getDanteInput(options.ch).mute == options.choice
			},
		},
		dante_output_gain: {
			type: 'boolean',
			name: 'Check Dante output gain',
			options: [Fields.Dante, Fields.GainSet(0)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getDanteOutput(options.ch).gain == options.gain
			},
		},
		dante_output_mute: {
			type: 'boolean',
			name: 'Check Dante output mute',
			options: [Fields.Dante, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getDanteOutput(options.ch).mute == options.choice
			},
		},
		exclusive_mute: {
			type: 'boolean',
			name: 'Check exclusive mute',
			options: [this.SEATS_FIELD, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).exclusiveMute == options.choice
			},
		},
		flash_apt: {
			type: 'boolean',
			name: 'Check APT flash state',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().flash == options.choice
			},
		},
		flash_seat: {
			type: 'boolean',
			name: 'Check device flash state',
			options: [this.SEATS_FIELD, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).flash == options.choice
			},
		},
		global_mute: {
			type: 'boolean',
			name: 'Check global mute',
			options: [Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().globalMute == options.choice
			},
		},
		interrupt_mode: {
			type: 'boolean',
			name: 'Check interruption mode',
			options: [Fields.InterruptMode],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().interruptMode == options.choice
			},
		},
		loudspeaker_volume: {
			type: 'boolean',
			name: 'Check the volume of loudspeakers for conference units',
			options: [Fields.GainSet(6)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().loudspeakerVolume == options.gain
			},
		},
		max_delegate_speakers: {
			type: 'boolean',
			name: 'Check the maximum number of delegate speakers',
			options: [Fields.MaxSet(8)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().maxDelegateSpeakers == options.val
			},
		},
		max_num_requests: {
			type: 'boolean',
			name: 'Check the maximum number of delegates allowed in request list',
			options: [Fields.MaxSet(50)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().maxNumRequests == options.val
			},
		},
		max_total_speakers: {
			type: 'boolean',
			name: 'Check the maximum number of speakers allowed',
			options: [Fields.MaxSet(8)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().maxTotalSpeakers == options.val
			},
		},
		mic_agc: {
			type: 'boolean',
			name: 'Check microphone AGC',
			options: [this.SEATS_FIELD, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).micAgc == options.choice
			},
		},
		mic_gain: {
			type: 'boolean',
			name: 'Check the microphone gain of conference unit',
			options: [this.SEATS_FIELD, Fields.GainSet(10)],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).micGain == options.gain
			},
		},
		mic_priority: {
			type: 'boolean',
			name: 'Check microphone priority',
			options: [this.SEATS_FIELD, Fields.Priority],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).micPriority == options.val
			},
		},
		mic_status: {
			type: 'boolean',
			name: 'Check microphone status',
			options: [this.SEATS_FIELD, Fields.OnOff],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).micStatus == options.choice
			},
		},
		operation_mode: {
			type: 'boolean',
			name: 'Check operation mode',
			options: [Fields.OperationMode],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().operationMode == options.choice
			},
		},
		request_list_status: {
			type: 'boolean',
			name: 'Check status of seat in request list',
			options: [this.SEATS_FIELD, Fields.ListStatus],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).requestListStatus == options.choice
			},
		},
		retain_seat_persistence: {
			type: 'boolean',
			name: 'Check retain seat information on reboot',
			options: [Fields.EnabledDisabled],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().retainSeatPersistence == options.choice
			},
		},
		rf_power: {
			type: 'boolean',
			name: 'Check RF power',
			options: [Fields.RfPower],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().rfPower == options.choice
			},
		},
		role: {
			type: 'boolean',
			name: 'Check role for device',
			options: [this.SEATS_FIELD, Fields.Role],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).role == options.choice
			},
		},
		speak_list_status: {
			type: 'boolean',
			name: 'Check status of seat in speaker list',
			options: [this.SEATS_FIELD, Fields.ListStatus],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).speakListStatus == options.choice
			},
		},
		unit_available: {
			type: 'boolean',
			name: 'Check if device is available',
			options: [this.SEATS_FIELD, Fields.UnitStatus],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getSeat(options.seat).unitAvailable == options.choice
			},
		},
		wdu_lock_welcome: {
			type: 'boolean',
			name: 'Check welcome screen lock status',
			options: [Fields.EnabledDisabled],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 255, 0),
			},
			callback: async ({ options }) => {
				return this.api.getReceiver().wduLockWelcome == options.choice
			},
		},
	})
}
