import { DevicesType } from "@/type";
import { createSlice } from "@reduxjs/toolkit";

type SingleDeviceType = {
  devices: DevicesType[]
  deviceForAlert: DevicesType
}

const emptyDeviceObject = {
  id: '',
  oem: '',
  name: '',
  type: '',
  temperature: 0,
  relativeHumidity: 0,
  location: {
    lat: 0,
    long: 0
  },
  signalStrength: 0,
  lastUpdated: '',
  isOffline: false
}

const initialState: SingleDeviceType = {
  devices: [],
  deviceForAlert: emptyDeviceObject
}

const devicesSlice = createSlice({
  name: 'Devices',
  initialState,
  reducers: {
    setDevicesToGlobal(state, action) {
      state.devices = action.payload;
    },
    setDeviceForAlert(state, action) {
      state.deviceForAlert = action.payload
    },
    resetAlertDevice(state) {
      state.deviceForAlert = emptyDeviceObject
    }
  }
})

export const { setDevicesToGlobal, setDeviceForAlert, resetAlertDevice } = devicesSlice.actions
export default devicesSlice.reducer