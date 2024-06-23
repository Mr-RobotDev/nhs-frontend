import { DevicesType } from '@/type';
import Image from 'next/image';
import React from 'react'

interface DeviceDetailProps {
  device: DevicesType;
}

const DeviceDetail = ({ device }: DeviceDetailProps) => {
  return (
    <div className=" flex flex-col md:flex-row gap-2 mt-4">
      <div className=" flex flex-row items-center justify-between">
        <p className="!m-0 text-center text-slate-700 !text-lg py-2 px-3 rounded-lg font-semibold">
          {device.name}
        </p>
      </div>


      {
        device.pressure ?
          <div className="!m-0 flex flex-row items-center gap-2">
            <div className="w-6 h-6">
              <Image
                src="/icons/highest-pressure.png"
                alt="Pressure"
                width={100}
                height={100}
              />
            </div>
            <strong className=" text-lg">{device.pressure} Pa</strong>
          </div>
          :
          <div className=" flex flex-row justify-between gap-6">
            <div className="!m-0 flex flex-row items-center gap-2">
              <div className="w-6 h-6">
                <Image
                  src="/icons/highest-temperature.png"
                  alt="temperature"
                  width={100}
                  height={100}
                />
              </div>
              <strong className=" text-lg">{device.temperature}°C</strong>
            </div>
            <div className="!m-0 flex flex-row items-center gap-2">
              <div className="w-6 h-6">
                <Image
                  src="/icons/highest-humidity.png"
                  alt="temperature"
                  width={100}
                  height={100}
                />
              </div>
              <strong className=" text-lg">{device.relativeHumidity} %</strong>
            </div>
          </div>
      }
    </div>
  )
}

export default DeviceDetail