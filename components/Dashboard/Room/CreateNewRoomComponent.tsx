import React from 'react'
import RoomForm from './RoomForm'
import { RoomFormType } from '@/type'

const CreateNewRoomComponent = () => {

  const room: RoomFormType = {
    code: "",
    name: "",
    function: "",
    netUseableArea: 0,
    department: "",
    division: "",
    cluster: "",
    clusterDescription: "",
    operationHours: "",
    hoursPerDay: 0
  }

  return (
    <RoomForm room={room} />
  )
}

export default CreateNewRoomComponent