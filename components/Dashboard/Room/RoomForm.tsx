import { PrimaryInput } from '@/components/ui/Input/Input';
import { RoomFormType } from '@/type';
import React, { useState } from 'react'

interface RoomFormProps {
  room: RoomFormType;
}

const RoomForm: React.FC<RoomFormProps> = ({ room }) => {
  const [formData, setFormData] = useState<RoomFormType>(room)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 gap-2'>
      <div>
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
      <div>
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
            value={formData.hoursPerDay.toString()}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default RoomForm