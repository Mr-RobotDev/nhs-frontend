import React from 'react'
import RoomForm from './RoomForm'
import { RoomFormType } from '@/type'

const CreateNewRoomComponent = ({ floorId, setOpen }: { floorId: string, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

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
    <RoomForm room={room} floorId={floorId} setOpen={setOpen} />
  )
}

export default CreateNewRoomComponent