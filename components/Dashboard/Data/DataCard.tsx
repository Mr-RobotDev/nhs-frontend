import { Card } from 'antd';
import React from 'react'
import CountUp from "react-countup";

interface DataCardProps {
  title: string;
  count: number;
  decimals: boolean;
}
const DataCard: React.FC<DataCardProps> = ({ title, count, decimals }) => {
  return (
    <Card className="!p-0">
      <div className="">
        <div className={'h-full rounded-lg bg-white'}>
          <div className={'text-xl font-semibold p-2 text-black'}>{title}</div>
          <hr />
          <div className=" w-full h-full flex justify-center items-center p-5">
            <p className={'text-3xl'}>
              <CountUp
                end={count}
                duration={2}
                decimals={decimals ? 2 : 0}
              />
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DataCard