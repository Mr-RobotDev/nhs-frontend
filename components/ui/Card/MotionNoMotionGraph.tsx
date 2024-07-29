import { DashboardCardType } from '@/type';
import { getDeviceLabelFromState } from '@/utils/helper_functions';
import { Popover } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const countStates = (devices: any) => {
  return devices.reduce(
    (acc: any, device: any) => {
      if (device.state === "MOTION_DETECTED") {
        acc.motionDetected.count++;
        acc.motionDetected.devices.push(device);
      } else if (device.state === "NO_MOTION_DETECTED") {
        acc.noMotionDetected.count++;
        acc.noMotionDetected.devices.push(device);
      }
      return acc;
    },
    {
      motionDetected: { count: 0, devices: [] },
      noMotionDetected: { count: 0, devices: [] },
    }
  );
};

interface MotionNoMotionGraphProps {
  cardObj: DashboardCardType;
  popoverWidth: number | undefined
}

const MotionNoMotionGraph: React.FC<MotionNoMotionGraphProps> = ({ cardObj, popoverWidth }) => {
  const { motionDetected, noMotionDetected } = countStates(cardObj.devices);
  const [isMobile, setIsMobile] = useState(false);

  const content = (
    <div className="bg-white flex flex-col gap-2 justify-start items-center w-full">
      <div className="flex flex-col gap-0 w-full">
        {motionDetected.devices.map((device: any) => (
          <Link key={device.id} href={`/dashboard/devices/${device.id}`}>
            <div className="flex flex-row gap-2 w-full">
              <p className="!mb-0">
                <strong className="mr-3">Occupied</strong> {device.name}
              </p>
            </div>
            <hr className="h-2 w-full my-1" />
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-0 w-full">
        {noMotionDetected.devices.map((device: any) => (
          <Link key={device.id} href={`/dashboard/devices/${device.id}`}>
            <div className="flex flex-row gap-2 w-full">
              <p className="!mb-0">
                <strong className="mr-3">Not Occupied</strong> {device.name}
              </p>
            </div>
            <hr className="h-2 w-full my-1" />
          </Link>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    // Detect if the user is on a mobile device
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
    );
    setIsMobile(mobile);
  }, []);


  return (
    <div className="flex-grow">
      {cardObj.devices.length > 1 ? (
        <Popover
          content={content}
          trigger={isMobile ? "click" : "hover"}
          placement="bottom"
          overlayStyle={{
            width: popoverWidth,
            paddingTop: 10,
            paddingBottom: 10
          }}
        >
          <div className="grid grid-cols-2 h-full">
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="mb-0 text-4xl font-semibold">
                  {motionDetected.count}
                </p>
                <p className="mt-1">Occupied</p>
              </div>
            </div>
            <div className="w-full h-full flex justify-center items-center border-l border-l-gray-300">
              <div className="flex flex-col items-center">
                <p className="mb-0 text-4xl font-semibold">
                  {noMotionDetected.count}
                </p>
                <p className="mt-1">Not Occupied</p>
              </div>
            </div>
          </div>
        </Popover>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-3xl font-semibold">
            {getDeviceLabelFromState(cardObj.devices[0].state)}
          </p>
        </div>
      )}
    </div>
  )
}

export default MotionNoMotionGraph