import { DevicesType } from '@/type';
import { getDeviceLabelFromState, iconsBasedOnType } from '@/utils/helper_functions';
import Image from 'next/image';
import React, { useEffect } from 'react'

interface DeviceDetailProps {
  device: DevicesType;
}


const DeviceDetail = ({ device }: DeviceDetailProps) => {

  useEffect(() => {
    console.log('device', device)
  }, [device])
  return (
    <div className=" flex flex-col md:flex-row gap-2 mt-4 items-center">
      <div className=' w-10 h-10'>
        <Image
          src={iconsBasedOnType(device.type || 'motion')}
          className=" w-full h-full"
          alt="icon"
          width={100}
          height={100}
        />
      </div>
      <div className=" flex flex-row items-center justify-between">
        <p className="!m-0 text-center text-slate-700 !text-lg py-2 px-3 rounded-lg font-semibold">
          {device.name}
        </p>
      </div>

      <p className=' !mb-0 text-base'>({getDeviceLabelFromState(device.state as string)})</p>
    </div>
  )
}

export default DeviceDetail