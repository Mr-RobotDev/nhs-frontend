import React from 'react'
import RoomForm from './RoomForm'
import { RoomFormType } from '@/type'

interface CreateNewRoomComponentProps {
  organizationId: string
  buildingId: string
  siteId: string
  floorId: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateNewRoomComponent: React.FC<CreateNewRoomComponentProps> = ({ organizationId, siteId, buildingId, floorId, setOpen }) => {

  const room: RoomFormType = {
    code: "",
    name: "",
    function: "",
    netUseableArea: '',
    department: "",
    division: "",
    cluster: "",
    clusterDescription: "",
    operationHours: "",
    hoursPerDay: '',
    organization: organizationId,
    site: siteId,
    building: buildingId,
    maxDeskOccupation: "",
    numWorkstations: ''
  }

  return (
    <RoomForm room={room} floorId={floorId} setOpen={setOpen} />
  )
}

export default CreateNewRoomComponent