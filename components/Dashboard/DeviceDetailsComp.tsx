import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { DevicesType } from "@/type";

interface DeviceDetailsCompProps {
  device: DevicesType;
}

const DeviceDetailsComp = ({ device }: DeviceDetailsCompProps) => {
  return (
    <div className=" w-48">
      <div className=" flex flex-col gap-2">
        <div className=" flex flex-row items-center justify-between px-1">
          <p className="!m-0 text-center bg-slate-700 text-white !text-xs py-2 px-3 rounded-lg font-semibold">
            {device.name}
          </p>
          <Link className="absolute top-1 right-0 p-2" target="_blank" href={`/dashboard/devices/${device.id}`}>
            <div>
              <ArrowTopRightOnSquareIcon width={20} />
            </div>
          </Link>
        </div>
        {
          device.type === 'pressure' ?
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
            <div className=" flex flex-row justify-between">
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
    </div>
  );
};

export default DeviceDetailsComp;
