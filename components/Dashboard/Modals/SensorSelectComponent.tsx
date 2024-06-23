import Image from 'next/image'
import React from 'react'

interface SensorSelectComponentProps {
  handleClick: (value: string) => void
  selectedSensors: string[]
  sensorType: string
  title: string
}

const typeToIconUrl: Record<string, string> = {
  temperature: '/icons/cold-or-freeze.png',
  relativeHumidity: '/icons/humidity.png',
  pressure: '/icons/highest-pressure.png',
};

const SensorSelectComponent = ({ handleClick, selectedSensors, sensorType, title }: SensorSelectComponentProps) => {
  return (
    <div
      onClick={() => handleClick(sensorType)}
      className={`flex flex-row items-center border rounded-lg p-3 gap-3 cursor-pointer duration-300 transition-all transform group ${selectedSensors.includes(sensorType)
        ? "bg-blue-100 border-blue-500"
        : "bg-gray-50 hover:bg-blue-100 hover:border-blue-300"
        }`}
    >
      <div
        className={`w-12 h-12 border rounded-md p-2 duration-300 transition-all ${selectedSensors.includes(sensorType)
          ? "bg-blue-100 border-blue-500"
          : "bg-gray-50 group-hover:bg-blue-100 group-hover:border-blue-300"
          }`}
      >
        <Image
          src={typeToIconUrl[sensorType]}
          alt="Temperature"
          width={100}
          height={100}
        />
      </div>
      <p className="!mb-0 text-lg font-semibold">{title}</p>
    </div>
  )
}

export default SensorSelectComponent