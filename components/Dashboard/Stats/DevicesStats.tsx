"use client";
import { RootState } from "@/app/store/store";
import { Card } from "antd";
import Image from "next/image";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import DeviceTypeDetail from "../Device/DeviceTypeDetail";
import { RoomStatsType } from "@/type";
import classNames from 'classnames';
import { occupanyColor } from "@/utils/helper_functions";

interface DeviceStatsProps {
  roomStats: RoomStatsType;
}

const DevicesStats = ({ roomStats }: DeviceStatsProps) => {
  const maxOccupantRoom = Math.max(roomStats.red, roomStats.amber, roomStats.green);
  const thresholds = 10;

  let maxVariableColor = '';
  let textColor = 'text-white';

  if (roomStats.red === 0 && roomStats.amber === 0 && roomStats.green === 0) {
    maxVariableColor = 'bg-white';
    textColor = 'text-black';
  } else if (roomStats.red === roomStats.amber && roomStats.amber === roomStats.green) {
    maxVariableColor = `bg-gradient-to-br from-custom-graph-red via-custom-graph-amber to-custom-graph-green`;
  } else if (roomStats.red === roomStats.amber && roomStats.red === maxOccupantRoom) {
    maxVariableColor = `bg-gradient-to-br from-custom-graph-red to-custom-graph-amber`;
  } else if (roomStats.red === roomStats.green && roomStats.red === maxOccupantRoom) {
    maxVariableColor = `bg-gradient-to-br from-custom-graph-red to-custom-graph-green`;
  } else if (roomStats.amber === roomStats.green && roomStats.amber === maxOccupantRoom) {
    maxVariableColor = `bg-gradient-to-br from-custom-graph-amber to-custom-graph-green`;
  } else if (maxOccupantRoom === roomStats.red) {
    maxVariableColor = `bg-custom-graph-red`;
  } else if (maxOccupantRoom === roomStats.amber) {
    maxVariableColor = `bg-custom-graph-amber`;
  } else if (maxOccupantRoom === roomStats.green) {
    maxVariableColor = `bg-custom-graph-green`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="!p-0 h-full">
        <div className=" h-full">
          <div className={classNames('h-full rounded-lg', maxVariableColor)}>
            <div className={classNames("text-xl font-semibold p-2", textColor)}>Maximum Occupant Room</div>
            <div className=" w-full h-full flex justify-center items-center">
              <p className={classNames('text-8xl', textColor)}>
                <CountUp
                  end={maxOccupantRoom}
                  duration={2}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Card className="!p-0">
          <div className=" h-[350px] overflow-y-auto">
          <h2 className=" text-xl font-semibold">Occupied Rooms</h2>
          {roomStats.rooms.length > 0 ?
            <div className=" mt-5 ">
              <div className="flex flex-wrap md:flex-nowrap gap-0 md:gap-3 w-full overflow-x-auto ">
                {Array.from({ length: Math.ceil(roomStats.rooms.length / thresholds) }).map((_, columnIndex) => (
                  <ul className=" mb-0" key={columnIndex}>
                    
                    {roomStats.rooms.slice(columnIndex * thresholds, (columnIndex + 1) * thresholds).map((room, index) => {
                      const bgColor = room.occupancy === 'red' ? 'bg-custom-graph-red' : (room.occupancy === 'green' ? 'bg-custom-graph-green' : 'bg-custom-graph-amber')
                      return <li className="mb-[6px] w-64 flex flex-row gap-2 items-center" key={index}>
                        <div className={classNames('w-[6px] h-[6px] rounded-full', bgColor)}></div>
                        {room.name}
                      </li>
                    })}
                  </ul>
                ))}
              </div>
            </div> :
            <div className=" w-full h-[250px] flex justify-center items-center">
              <p className=" font-semibold text-3xl">No Data Available</p>
            </div>
          }
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DevicesStats;
