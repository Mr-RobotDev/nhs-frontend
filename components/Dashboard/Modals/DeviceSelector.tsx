import React, { memo, useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { DevicesType, Event } from "@/type";
import SimSignal from "../Device/SimSignal";
import { useTimeAgo } from "next-timeago";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { setDeviceForAlert, setDevicesToGlobal } from "@/app/store/slice/devicesSlice";
import { iconsBasedOnType } from "@/utils/helper_functions";

interface DevicesSelectorProps {
  setSelectedRowKeys: (selectedRowKeys: string[]) => void;
  selectedRowKeys: string[];
  allowSingleDevice?: boolean;
  deviceType?: string;
}

const DevicesSelector = ({
  selectedRowKeys,
  setSelectedRowKeys,
  allowSingleDevice,
  deviceType
}: DevicesSelectorProps) => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [loading, setLoading] = useState(false)
  const { TimeAgo } = useTimeAgo();
  const dispatch: AppDispatch = useDispatch()

  const addOrRemoveDeviceIdToTheList = (e: any, id: string) => {
    e.stopPropagation()
    const deviceToStore = devices.find(device => device.id === id)
    dispatch(setDeviceForAlert(deviceToStore))
    setSelectedRowKeys([id]);
  }

  const columns: TableProps<DevicesType>["columns"] = [
    {
      title: "Type",
      dataIndex: "type",
      render: (_, { type }) => (
        <div className="flex flex-row items-center gap-7">
          <div className="w-5 h-5">
            <Image
              src={iconsBasedOnType(type)}
              alt="icon"
              width={100}
              height={100}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Name",
      render: (_, { name }) => (
        <div className="flex flex-row items-center">
          <p className="!text-black">{name}</p>
        </div>
      ),
    },
    {
      title: "Last Updated",
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
      title: "Signal",
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
  ];

  if(allowSingleDevice){
    columns.unshift({
      title: "Add",
      dataIndex: "add",
      render: (_, { id }) => (
        <div className="flex flex-row items-center" onClick={(e) => addOrRemoveDeviceIdToTheList(e, id)}>
          {selectedRowKeys.includes(id) ? <MinusCircleIcon width={25} className=" text-red-400" /> : <PlusCircleIcon width={25} className=" text-blue-700" />}
        </div>
      ),
    })
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const params: any = { page: 1, limit: 50 };
        if (deviceType) {
          params.type = deviceType === 'pressure' ? 'pressure' : 'humidity,cold';
        }
        const response = await axiosInstance.get("/devices", { params });
        if (response.status === 200) {
          setDevices(response.data.results);
          dispatch(setDevicesToGlobal(response.data.results));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, deviceType]);

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        if (allowSingleDevice) return;
        const selectedKey = record.id;
        if (selectedRowKeys.includes(selectedKey)) {
          setSelectedRowKeys(
            selectedRowKeys.filter((key) => key !== selectedKey)
          );
        } else {
          setSelectedRowKeys([...selectedRowKeys, selectedKey]);
        }
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
        onRow={(record) => onRowClick(record)}
        rowClassName={(record) =>
          selectedRowKeys.includes(record.id)
            ? "ant-table-row-selected !border-2 !border-blue-500"
            : ""
        }
      />
    </div>
  );
};

export default DevicesSelector;
