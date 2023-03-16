import { iterate, parse } from 'multi-integer-range'

/**
 * INTERNAL: initialize variables.
 */
export function updateVariables() {
	let variables = []

	variables.push({ variableId: 'audio_input_speaklist', name: 'Audio Input Speak List' })
	variables.push({ variableId: 'audio_meter_rate', name: 'Audio Meter Rate' })
	variables.push({ variableId: 'device_id', name: 'Device ID' })
	variables.push({ variableId: 'flash', name: 'Flash' })
	variables.push({ variableId: 'global_mute', name: 'Global Mute' })
	variables.push({ variableId: 'interrupt_mode', name: 'Interrupt Mode' })
	variables.push({ variableId: 'loudspeaker_volume', name: 'Loudspeaker Volume' })
	variables.push({ variableId: 'max_delegate_speakers', name: 'Max Delegate Speakers' })
	variables.push({ variableId: 'max_num_requests', name: 'Max Num Requests' })
	variables.push({ variableId: 'max_total_speakers', name: 'Max Total Speakers' })
	variables.push({ variableId: 'model', name: 'Model' })
	variables.push({ variableId: 'operation_mode', name: 'Operation Mode' })
	variables.push({ variableId: 'retain_seat_persistence', name: 'Retain Seat Persistence' })
	variables.push({ variableId: 'rf_meter_rate', name: 'RF Meter Rate' })
	variables.push({ variableId: 'rf_power', name: 'RF Power' })
	variables.push({ variableId: 'wdu_lock_welcome', name: 'WDU Lock Welcome' })

	variables.push({ variableId: 'aux_input_agc', name: 'Aux Input AGC' })
	variables.push({ variableId: 'aux_input_gain', name: 'Aux Input Gain' })
	variables.push({ variableId: 'aux_input_mute', name: 'Aux Input Mute' })
	variables.push({ variableId: 'aux_input_pad', name: 'Aux Input Pad' })

	variables.push({ variableId: 'aux_output_gain', name: 'Aux Output Gain' })
	variables.push({ variableId: 'aux_output_mute', name: 'Aux Output Mute' })

	for (let i = 1; i <= 8; i++) {
		variables.push({ variableId: `dante_input_${i}_agc`, name: `Dante Input ${i} AGC` })
		variables.push({ variableId: `dante_input_${i}_gain`, name: `Dante Input ${i} Gain` })
		variables.push({ variableId: `dante_input_${i}_mute`, name: `Dante Input ${i} Mute` })

		variables.push({ variableId: `dante_output_${i}_gain`, name: `Dante Output ${i} Gain` })
		variables.push({ variableId: `dante_output_${i}_mute`, name: `Dante Output ${i} Mute` })
	}

	for (let i of iterate(parse(this.config.range))) {
		let prefix = `seat_${i}`

		variables.push({ variableId: `${prefix}_name`, name: `Seat ${i} Name` })
		variables.push({ variableId: `${prefix}_batt_charge`, name: `Seat ${i} Battery Charge` })
		variables.push({ variableId: `${prefix}_batt_cycle`, name: `Seat ${i} Battery Cycle` })
		variables.push({ variableId: `${prefix}_batt_health`, name: `Seat ${i} Battery Health` })
		variables.push({ variableId: `${prefix}_batt_run_time`, name: `Seat ${i} Battery Run Time` })
		variables.push({ variableId: `${prefix}_exclusive_mute`, name: `Seat ${i} Exclusive Mute` })
		variables.push({ variableId: `${prefix}_flash`, name: `Seat ${i} Flash` })
		variables.push({ variableId: `${prefix}_mic_agc`, name: `Seat ${i} Mic AGC` })
		variables.push({ variableId: `${prefix}_mic_gain`, name: `Seat ${i} Mic Gain` })
		variables.push({ variableId: `${prefix}_mic_priority`, name: `Seat ${i} Mic Priority` })
		variables.push({ variableId: `${prefix}_mic_status`, name: `Seat ${i} Mic Status` })
		variables.push({ variableId: `${prefix}_request_list_status`, name: `Seat ${i} Request List Status` })
		variables.push({ variableId: `${prefix}_role`, name: `Seat ${i} Role` })
		variables.push({ variableId: `${prefix}_rssi`, name: `Seat ${i} RSSI` })
		variables.push({ variableId: `${prefix}_speak_list_status`, name: `Seat ${i} Speak List Status` })
		variables.push({ variableId: `${prefix}_unit_available`, name: `Seat ${i} Unit Available` })
	}

	this.setVariableDefinitions(variables)
}
