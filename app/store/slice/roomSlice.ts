import axiosInstance from "@/lib/axiosInstance";
import { RoomFormType } from "@/type";
import { emptyRoomObject } from "@/utils/form";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  room: RoomFormType
  allrooms: RoomFormType[]
}

const initialState: initialStateType = {
  room: emptyRoomObject,
  allrooms: []
}

const roomFormSlice = createSlice({
  name: 'Room',
  initialState,
  reducers: {
    setNewRoom(state, action) {
      state.room = action.payload;
    }
  },
})

export const { setNewRoom } = roomFormSlice.actions
export default roomFormSlice.reducer