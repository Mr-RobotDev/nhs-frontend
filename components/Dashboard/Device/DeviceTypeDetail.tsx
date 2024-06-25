import { Card } from 'antd'
import Image from 'next/image';
import React from 'react'
import CountUp from "react-countup";

interface DeviceTypeDetailProps {
  title: string;
  subtitle?: string;
  value: number;
  image: string;
}

const DeviceTypeDetail = ({ title, value, image, subtitle }: DeviceTypeDetailProps) => {
  return (
    <>
      <Card bordered={false} className="criclebox h-full">
        <div className=" text-2xl flex flex-row justify-between">
          <div>
            <div className='flex flex-col gap-0 '>
              <p className=" text-2xl font-semibold !mb-0">{title}</p>
              <p className=' mb-1 text-sm h-5'>{subtitle }</p>
            </div>
            <div className="text-2xl font-bold">
              <span className="!text-3xl !font-bold">
                <CountUp
                  end={value}
                  duration={2}
                />
              </span>
            </div>
          </div>
          <div className=" w-13 h-14 flex items-center justify-center ml-auto">
            <Image
              src={image}
              className=" w-full h-full"
              alt="icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

export default DeviceTypeDetail