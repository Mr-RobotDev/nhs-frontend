import { createSlice } from "@reduxjs/toolkit";

type DevicesStats = {
  totalDevices: number;
  highestTemperature: number;
  highestRelativeHumidity: number;
  highestPressure: number;
  online: number;
  offline: number;
}

const initialState: DevicesStats = {
  totalDevices: 0,
  highestTemperature: 0,
  highestRelativeHumidity: 0,
  highestPressure: 0,
  online: 0,
  offline: 0
}

const statisticsSlice = createSlice({
  name: 'Statistics',
  initialState,
  reducers: {
    setDevicesStats(state, action) {
      const { totalDevices, highestTemperature, highestRelativeHumidity, online, offline, highestPressure } = action.payload;
      state.totalDevices = totalDevices;
      state.highestTemperature = highestTemperature;
      state.highestRelativeHumidity = highestRelativeHumidity;
      state.highestPressure = highestPressure;
      state.online = online
      state.offline = offline
    }
  }
})

export const { setDevicesStats } = statisticsSlice.actions
export default statisticsSlice.reducer