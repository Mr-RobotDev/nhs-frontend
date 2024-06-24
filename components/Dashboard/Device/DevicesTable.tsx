import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DevicesType } from "@/type";
import SimSignal from "./SimSignal";
import { useTimeAgo } from "next-timeago";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import useIsMobile from "@/app/hooks/useMobile";
import './DeviceTable.css'
import { iconsBasedOnType } from "@/utils/helper_functions";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const DevicesTable = () => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [loading, setLoading] = useState(false);
  const { TimeAgo } = useTimeAgo();
  const isMobile = useIsMobile();

  let columns: TableProps<DevicesType>["columns"] = [
    {
      title: "TYPE",
      dataIndex: "type",
      render: (_,) => (
        <div className=" flex flex-row items-center">
          <div className=" w-10 h-10">
            <Image
              src={'/icons/motion-sensor.png'}
              alt="icon"
              className=" w-full h-full"
              width={100}
              height={100}
            />
          </div>
        </div>
      ),
    },
    {
      title: "NAME",
      render: (_, { name }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{name}</p>
        </div>
      ),
    },
    {
      title: 'STATE',
      dataIndex: 'state',
      render: (_, { state }) => (
        <div className=" w-20 md:w-full whitespace-normal">
          {<p className=" !text-black">{state === 'MOTION_DETECTED' ? 'Motion Detected' : 'No Motion Detected'}</p>}
        </div>
      ),
    },
    {
      title: "SENSOR ID",
      key: 'sensorId',
      render: (_, { oem }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          {oem ? <p className=" !text-black">{oem}</p> : <p>-</p>}
        </div>
      ),
    },
    {
      title: "LAST UPDATED",
      key: "lastUpdated",
      render: (_, { lastUpdated }) =>
        lastUpdated ? (
          <div className="flex flex-row items-center">
            <TimeAgo date={new Date(lastUpdated)} locale="en" />
          </div>
        ) : (
          <div>
            <p className="!text-2xl !ml-4">-</p>
          </div>
        ),
    },
    {
      title: "SIGNAL",
      render: (_, { isOffline, signalStrength, type }) => (
        <>
          {type === 'pressure' ? (
            <p>-</p>
          ) : (
            !isOffline ? (
              <div className="flex flex-row items-center">
                <SimSignal signalStrength={signalStrength} />
              </div>
            ) : (
              <div>
                <Tag color="error">Offline</Tag>
              </div>
            )
          )}
        </>
      )
    },
    {
      title: "ACTIONS",
      key: "actions",
      dataIndex: "aactions",
      render: (_, { id }) => {
        return (
          <div className=" flex flex-row items-center gap-2">
            <Link
              target="_blank"
              href={`/dashboard/devices/${id}/activity-logs`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="group px-2 py-1 text-blue-500 hover:text-blue-600 duration-150 transition-all transform rounded-md flex flex-row gap-2">
                Activity Logs
                <ArrowUpRightIcon
                  width={16}
                  className="transform transition-transform duration-150 group-hover:translate-x-1"
                />
              </div>
            </Link>
            <div className=" border-l border-l-gray-400 px-3">
              <span onClick={(e) => handleDeleteDevice(e, id)}>
                <TrashIcon className=" text-red-500" width={20} />
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  const handleDeleteDevice = async (e: any, deviceId: string) => {
    e.stopPropagation()
    setLoading(true)
    try{
      const response = await axiosInstance.delete(`/devices/${deviceId}`)
      if(response.status === 200){
        const updatedDevices = devices.filter((device) => device.id!== deviceId);
        setDevices(updatedDevices);
        toast.success('Device Removed')
      }
    }catch(error: any){
      console.log(error)
    }finally{
      setLoading(false)
    }
    console.log(deviceId)
  }

  if (isMobile) {
    columns = columns.filter(column => column.key !== 'lastUpdated' && column.key !== 'sensorId');
  }

  const router = useRouter();
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get("/devices?page=1&limit=50");
        if (response.status === 200) {
          setDevices(response.data.results);
        }
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false)
      }
    })();
  }, []);

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`);
      },
    };
  };

  return (
    <div className="mt-8">
      <Table
        columns={columns}
        dataSource={devices}
        scroll={{ x: 500 }}
        loading={loading}
        className="cursor-pointer"
        onRow={onRowClick}
      />
    </div>
  );
};

export default DevicesTable;
