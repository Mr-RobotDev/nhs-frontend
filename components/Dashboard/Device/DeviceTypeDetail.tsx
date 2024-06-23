import { Card } from 'antd'
import Image from 'next/image';
import React from 'react'
import CountUp from "react-countup";

interface DeviceTypeDetailProps {
  title: string;
  value: number;
  image: string;
}

const DeviceTypeDetail = ({ title, value, image }: DeviceTypeDetailProps) => {
  return (
    <>
      <Card bordered={false} className="criclebox h-full">
        <div className=" text-2xl flex flex-row justify-between">
          <div>
            <span className=" text-lg !mb-0">{title}</span>
            <div className="text-2xl font-bold">
              <span className="!text-3xl !font-bold">
                <CountUp
                  decimals={2}
                  end={value}
                  duration={2}
                />
              </span>
            </div>
          </div>
          <div className=" w-12 h-12 flex items-center justify-center ml-auto">
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