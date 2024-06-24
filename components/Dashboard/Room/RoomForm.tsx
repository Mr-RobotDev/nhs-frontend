import { setNewRoom } from '@/app/store/slice/roomSlice';
import { PrimaryInput } from '@/components/ui/Input/Input';
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper';
import axiosInstance from '@/lib/axiosInstance';
import { RoomFormType } from '@/type';
import { Button } from 'antd';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface RoomFormProps {
  room: RoomFormType;
  floorId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RoomForm: React.FC<RoomFormProps> = ({ room, floorId, setOpen }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<RoomFormType>(room)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCreateNewRoom = async () => {

    const requiredFields = Object.keys(formData);

    for (const field of requiredFields) {
      if ((formData as any)[field] === '') {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    try {
      setLoading(true)

      formData.netUseableArea = parseFloat(formData.netUseableArea.toString())
      formData.hoursPerDay = parseInt(formData.hoursPerDay.toString())

      const response = await axiosInstance.post(`floors/${floorId}/rooms`, formData)
      if(response.status === 201){
        toast.success('Room created successfully')
        dispatch(setNewRoom(response.data))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
    console.log(formData)
  }
  return (
    <LoadingWrapper loading={loading}>
      <h1 className='text-2xl font-semibold'>Add New Room Details</h1>
      <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className=' flex flex-col gap-4'>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Code</p>
            <PrimaryInput
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Name</p>
            <PrimaryInput
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Function</p>
            <PrimaryInput
              name="function"
              value={formData.function}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Net Useable Area </p>
            <PrimaryInput
              name="netUseableArea"
              type='number'
              value={formData.netUseableArea.toString()}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Department</p>
            <PrimaryInput
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className=' flex flex-col gap-4'>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Division</p>
            <PrimaryInput
              name="division"
              value={formData.division}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Cluster</p>
            <PrimaryInput
              name="cluster"
              value={formData.cluster}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Cluster Description</p>
            <PrimaryInput
              name="clusterDescription"
              value={formData.clusterDescription}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Operation Hours</p>
            <PrimaryInput
              name="operationHours"
              value={formData.operationHours}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold !text-sm !mb-1">Hours Per Day</p>
            <PrimaryInput
              name="hoursPerDay"
              type='number'
              value={formData.hoursPerDay.toString()}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className=' flex justify-end mt-5'>
        <Button onClick={handleCreateNewRoom} type='primary'>Create New Room</Button>
      </div>
    </LoadingWrapper>
  )
}

export default RoomForm