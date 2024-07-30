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
    <Card bordered={false} className="criclebox h-full">
      <div className=" text-2xl flex flex-row justify-between">
        <div className="w-10/12">
          <span className=" text-lg">{title}</span>
          <div className="">
            <span className="">
              <p className="!text-2xl !font-bold !mb-0">
                <CountUp
                  end={count}
                  duration={2}
                  decimals={decimals ? 2 : 0}
                />
              </p>
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DataCard