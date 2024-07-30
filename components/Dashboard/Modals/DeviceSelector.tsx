import React, { memo, useCallback, useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { DevicesType, Event } from "@/type";
import SimSignal from "../Device/SimSignal";
import { useTimeAgo } from "next-timeago";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store/store";
import { setDeviceForAlert, setDevicesToGlobal } from "@/app/store/slice/devicesSlice";
import { convertObjectToQueryString, iconsBasedOnType } from "@/utils/helper_functions";
import useDebounce from "@/app/hooks/useDebounce";
import { PrimaryInput } from "@/components/ui/Input/Input";
import './deviceSelectorTable.css'

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
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

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
          <div className="w-10 h-10">
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
      title: 'State',
      dataIndex: 'state',
      render: (_, { state }) => (
        <div className=" w-20 md:w-full whitespace-normal">
          {<p className=" !text-black">{state === 'MOTION_DETECTED' ? 'Motion Detected' : 'No Motion Detected'}</p>}
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

  if (allowSingleDevice) {
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

  const fetchDevices = useCallback(async (search: string, page: number, limit: number) => {
    const queryParams = convertObjectToQueryString({
      search,
      page,
      limit
    })

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/devices?${queryParams}`);
      if (response.status === 200) {
        setDevices(response.data.results);
        dispatch(setDevicesToGlobal(response.data.results));
        setCurrentPage(response.data.pagination.page);
        setPageSize(response.data.pagination.limit);
        setTotalItems(response.data.pagination.totalResults);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch])

  useEffect(() => {
    fetchDevices(debouncedSearch, currentPage, pageSize)
  }, [debouncedSearch, fetchDevices, currentPage, pageSize])

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

  const handleTableChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    setPageSize(10);
  }

  return (
    <div className="mt-8">
      <div className="pr-10 mb-6">
        <p className="!text-base font-bold !mb-0">Search</p>
        <PrimaryInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className=""
          placeholder="Search By Name or Sensor ID"
        />
      </div>
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handleTableChange,
          showSizeChanger: false
        }}
      />
    </div>
  );
};

export default DevicesSelector;
