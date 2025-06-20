import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DevicesType, SingleNameIdObject } from "@/type";
import SimSignal from "./SimSignal";
import { useTimeAgo } from "next-timeago";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import useIsMobile from "@/app/hooks/useMobile";
import './DeviceTable.css';
import { convertObjectToQueryString, tranformObjectForSelectComponent } from "@/utils/helper_functions";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import LoadingWrapper from "@/components/ui/LoadingWrapper/LoadingWrapper";
import { PrimaryInput } from "@/components/ui/Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "@/app/hooks/useDebounce";

const emptyFilters = {
  organization: [] as string[],
  site: [] as string[],
  building: [] as string[],
  floor: [] as string[],
  room: [] as string[],
  search: ''
}

const initialStateDropdownsData = {
  organization: [] as SingleNameIdObject[],
  site: [] as SingleNameIdObject[],
  building: [] as SingleNameIdObject[],
  floor: [] as SingleNameIdObject[],
  room: [] as SingleNameIdObject[]
}

const DevicesTable = () => {
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [devicesFilterLoading, setDevicesFilterLoading] = useState(false);
  const clearFilterTriggered = useRef(false);
  const [clearInternalStateFlag, setClearInternalStateFlag] = useState(false);
  const [deviceFilters, setDeviceFilters] = useState(emptyFilters);
  const debouncedFilters = useDebounce(deviceFilters, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const { TimeAgo } = useTimeAgo();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState(initialStateDropdownsData);

  // Initialize deviceFilters from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = { ...emptyFilters };

    if (params.has('organization')) {
      initialFilters.organization = params.getAll('organization');
    }
    if (params.has('site')) {
      initialFilters.site = params.getAll('site');
    }
    if (params.has('building')) {
      initialFilters.building = params.getAll('building');
    }
    if (params.has('floor')) {
      initialFilters.floor = params.getAll('floor');
    }
    if (params.has('room')) {
      initialFilters.room = params.getAll('room');
    }
    if (params.has('search')) {
      initialFilters.search = params.get('search') || '';
    }

    setDeviceFilters(initialFilters);
  }, []);

  let columns: TableProps<DevicesType>["columns"] = [
    {
      title: "TYPE",
      dataIndex: "type",
      render: (_, record) => (
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
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/devices/${deviceId}`);
      if (response.status === 200) {
        const updatedDevices = devices.filter((device) => device.id !== deviceId);
        setDevices(updatedDevices);
        toast.success('Device Removed');
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    columns = columns.filter(column => column.key !== 'lastUpdated' && column.key !== 'sensorId');
  }

  const fetchDevices = useCallback(async (filters: any, page: number, limit: number) => {
    const filtersWithPagination = {
      ...filters,
      page,
      limit
    }
    const queryParams = convertObjectToQueryString(filtersWithPagination);
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/devices?${queryParams}`);
      if (response.status === 200) {
        setDevices(response.data.results);
        setCurrentPage(response.data.pagination.page);
        setPageSize(response.data.pagination.limit);
        setTotalItems(response.data.pagination.totalResults);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(
    async (url: string, key: string, queryparams?: any) => {
      const newStringParams = convertObjectToQueryString(queryparams);
      try {
        setDevicesFilterLoading(true);
        const response = await axiosInstance.get(`${url}?page=1&limit=50&${newStringParams}`);
        if (response.status === 200) {
          setData(prevData => ({ ...prevData, [key]: response.data.results }));
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setDevicesFilterLoading(false);
      }
    },
    []
  );

  const updateQueryParams = useCallback((filters: any) => {
    const queryParams = new URLSearchParams();

    filters.organization.forEach((org: any) => queryParams.append('organization', org));
    filters.site.forEach((site: any) => queryParams.append('site', site));
    filters.building.forEach((building: any) => queryParams.append('building', building));
    filters.floor.forEach((floor: any) => queryParams.append('floor', floor));
    filters.room.forEach((room: any) => queryParams.append('room', room));
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    const queryString = queryParams.toString();
    router.push(`/dashboard/devices?${queryString}`);
  }, [router])

  useEffect(() => {
    fetchDevices(debouncedFilters, currentPage, pageSize);
    updateQueryParams(debouncedFilters);
  }, [debouncedFilters, fetchDevices, updateQueryParams, currentPage, pageSize]);

  useEffect(() => {
    fetchData('/organizations', 'organization', {});
    fetchData('/sites', 'site', {});
    fetchData('/buildings', 'building', {});
    fetchData('/floors', 'floor', {});
    fetchData('/rooms', 'room', {});
  }, [fetchData]);

  const clearFilterHandler = () => {
    setClearInternalStateFlag(true);
    clearFilterTriggered.current = true;
    setDeviceFilters(emptyFilters);
    router.push(`/dashboard/devices`);
    fetchDevices(emptyFilters, 1, 10);
  };

  const handleClearInternalState = () => {
    setClearInternalStateFlag(false);
  };

  const onRowClick = (record: DevicesType) => {
    return {
      onClick: () => {
        router.push(`/dashboard/devices/${record.id}`);
      },
    };
  };

  const handleTableChange = (newPagination: any) => {
    setCurrentPage(newPagination);
    setPageSize(10);
  };

  const handleChangeDeviceFilters = (key: string, value: string | string[]) => {
    setDeviceFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
  }

  return (
    <>
      <div className=" flex flex-col md:flex-row md:gap-4">
        <div className=" md:my-3 flex-1">
          <p className="font-semibold text-base !mb-0">Search</p>
          <PrimaryInput
            name="name"
            value={deviceFilters.search}
            onChange={(e) => handleChangeDeviceFilters('search', e.target.value)}
            placeholder="Search By Name or Sensor ID"
          />
        </div>
        <div className=" flex items-center md:justify-center mt-3 md:mt-7">
          <div className=" flex justify-start w-[148px]">
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="button_ready-animation w-full cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-custom-nhs-blue text-white hover:bg-blue-600 transition-all ease-in-out duration-300 flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faFilter} />
              {showFilters ? 'Hide' : 'Show'} Filters
            </div>
          </div>
        </div>
      </div>

      <LoadingWrapper loading={devicesFilterLoading} >
        <div className={`overflow-hidden transform ${showFilters ? 'h-full' : 'h-0'}`}>
          <div className={`border border-gray-200 rounded-md p-6 my-5`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div>
                <p className="!mb-1 font-semibold">Organizations</p>
                <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                  <CustomMenu
                    handleTypeChange={(vals: string[]) => handleChangeDeviceFilters('organization', vals)}
                    initialValue={deviceFilters.organization}
                    placeholderText="Select the Organizations"
                    isAdmin={true}
                    options={tranformObjectForSelectComponent(data.organization)}
                    createNewRoom={false}
                    multiple={true}
                    clearInternalStateFlag={clearInternalStateFlag}
                    onClearInternalState={handleClearInternalState}
                    apiEndpoint="/organizations?page=1&limit=50"
                    searchable={true}
                  />
                </div>
              </div>
              <div>
                <p className="!mb-1 font-semibold">Sites</p>
                <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                  <CustomMenu
                    handleTypeChange={(vals: string[]) => handleChangeDeviceFilters('site', vals)}
                    initialValue={deviceFilters.site}
                    placeholderText="Select the Sites"
                    isAdmin={true}
                    options={tranformObjectForSelectComponent(data.site)}
                    createNewRoom={false}
                    multiple={true}
                    clearInternalStateFlag={clearInternalStateFlag}
                    onClearInternalState={handleClearInternalState}
                    apiEndpoint={`/sites?${convertObjectToQueryString({ organization: deviceFilters.organization })}`}
                    searchable={true}
                  />
                </div>
              </div>
              <div>
                <p className="!mb-1 font-semibold">Buildings</p>
                <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                  <CustomMenu
                    handleTypeChange={(vals: string[]) => handleChangeDeviceFilters('building', vals)}
                    initialValue={deviceFilters.building}
                    placeholderText="Select the buidings"
                    isAdmin={true}
                    options={tranformObjectForSelectComponent(data.building)}
                    createNewRoom={false}
                    multiple={true}
                    clearInternalStateFlag={clearInternalStateFlag}
                    onClearInternalState={handleClearInternalState}
                    apiEndpoint={`/buildings?${convertObjectToQueryString({ site: deviceFilters.site })}`}
                    searchable={true}
                  />
                </div>
              </div>
              <div>
                <p className="!mb-1 font-semibold">Floors</p>
                <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                  <CustomMenu
                    handleTypeChange={(vals: string[]) => handleChangeDeviceFilters('floor', vals)}
                    initialValue={deviceFilters.floor}
                    placeholderText="Select the floors"
                    isAdmin={true}
                    options={tranformObjectForSelectComponent(data.floor)}
                    createNewRoom={false}
                    multiple={true}
                    clearInternalStateFlag={clearInternalStateFlag}
                    onClearInternalState={handleClearInternalState}
                    apiEndpoint={`/floors?${convertObjectToQueryString({ building: deviceFilters.building })}`}
                    searchable={true}
                  />
                </div>
              </div>
              <div>
                <p className="!mb-1 font-semibold">Rooms</p>
                <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                  <CustomMenu
                    handleTypeChange={(vals: string[]) => handleChangeDeviceFilters('room', vals)}
                    initialValue={deviceFilters.room}
                    placeholderText="Select the rooms"
                    isAdmin={true}
                    options={tranformObjectForSelectComponent(data.room)}
                    createNewRoom={false}
                    multiple={true}
                    clearInternalStateFlag={clearInternalStateFlag}
                    onClearInternalState={handleClearInternalState}
                    apiEndpoint={`/rooms?${convertObjectToQueryString({ floor: deviceFilters.floor })}`}
                    searchable={true}
                  />
                </div>
              </div>
            </div>
            <div className=" flex flex-row gap-3 my-2 justify-end">
              <Button danger onClick={clearFilterHandler}>Clear Filters</Button>
            </div>
          </div>
        </div>
      </LoadingWrapper>
      <div className="mt-8">
        <Table
          columns={columns}
          dataSource={devices}
          scroll={{ x: 500 }}
          loading={loading}
          className="cursor-pointer"
          onRow={onRowClick}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            onChange: handleTableChange,
          }}
        />
      </div>
    </>
  );
};

export default DevicesTable;
