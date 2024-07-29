"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "../Stats/DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import { Button, Card, DatePicker, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import FullScreenButton from "@/components/ui/FullScreenButton/FullScreenButton";
import { RoomStatsType, SingleNameIdObject } from "@/type";
import { convertObjectToQueryString, tranformObjectForSelectComponent } from "@/utils/helper_functions";
import { useRouter } from "next/navigation";
import useDebounce from "@/app/hooks/useDebounce";
import LoadingWrapper from "@/components/ui/LoadingWrapper/LoadingWrapper";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { PrimaryInput } from "@/components/ui/Input/Input";
import dayjs from 'dayjs';
import DataCard from "./DataCard";
import { Switch } from 'antd';

const { RangePicker } = DatePicker;

const emptyFilters = {
  organization: [] as string[],
  site: [] as string[],
  building: [] as string[],
  floor: [] as string[],
  room: [] as string[],
  from: dayjs().format('YYYY-MM-DD'),
  to: dayjs().format('YYYY-MM-DD'),
  includeWeekends: false
};

const initialStateDropdownsData = {
  organization: [] as SingleNameIdObject[],
  site: [] as SingleNameIdObject[],
  building: [] as SingleNameIdObject[],
  floor: [] as SingleNameIdObject[],
};

interface RoomDataType {
  totalOccupancy: number;
  totalNetUseableArea: number;
  totalMaxUseableDesks: number;
  totalMaxUseableWorkstations: number;
}

const MainDataView = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [roomData, setRoomData] = useState<RoomDataType | null>();
  const [loading, setLoading] = useState(false);
  const [devicesFilterLoading, setDevicesFilterLoading] = useState(false);
  const [deviceFilters, setDeviceFilters] = useState(emptyFilters);
  const [clearInternalStateFlag, setClearInternalStateFlag] = useState(false);
  const debouncedFilters = useDebounce(deviceFilters, 500);
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState(initialStateDropdownsData);
  const clearFilterTriggered = useRef(false);

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
    if (params.has('from')) {
      initialFilters.from = params.get('from') as string;
    }
    if (params.has('to')) {
      initialFilters.to = params.get('to') as string;
    }
    if (params.has('includeWeekends')) {
      initialFilters.includeWeekends = params.get('includeWeekends') === 'true' ? true : false;
    }

    setDeviceFilters(initialFilters);
  }, []);

  const fetchRoomStats = useCallback(async (filters: any) => {
    const { from, to, ...newFilters } = filters;

    const queryParams = convertObjectToQueryString(
      {
        ...newFilters,
        ...(from ? { from } : {}),
        ...(to ? { to } : {})
      }
    );

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/rooms/data?${queryParams}`);
      if (response.status === 200) {
        setRoomData(response.data);
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
        setDevicesFilterLoading(false);
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
    if (filters.from) {
      queryParams.append('from', filters.from);
    }
    if (filters.to) {
      queryParams.append('to', filters.to);
    }
    if (filters.includeWeekends) {
      queryParams.append('includeWeekends', filters.includeWeekends);
    }

    const queryString = queryParams.toString();
    router.push(`/dashboard/data?${queryString}`);
  }, [router]);

  useEffect(() => {
    fetchRoomStats(debouncedFilters);
    updateQueryParams(debouncedFilters);
  }, [debouncedFilters, fetchRoomStats, updateQueryParams]);

  useEffect(() => {
    fetchData('/organizations', 'organization', {});
    fetchData('/sites', 'site', {});
    fetchData('/buildings', 'building', {});
    fetchData('/floors', 'floor', {});
  }, [fetchData]);

  const clearFilterHandler = () => {
    setClearInternalStateFlag(true);
    clearFilterTriggered.current = true;
    setDeviceFilters(prev => ({
      organization: [],
      site: [],
      building: [],
      floor: [],
      room: [],
      from: prev.from,
      to: prev.to,
      includeWeekends: false,
    }));

    router.push(`/dashboard/data`);
    fetchRoomStats(emptyFilters);
  };

  const handleClearInternalState = () => {
    setClearInternalStateFlag(false);
  };

  const handleIncludeWeekends = () => {
    setDeviceFilters((prev) => ({
      ...prev,
      includeWeekends: !prev.includeWeekends,
    }));
  }

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDeviceFilters((prev) => ({
      ...prev,
      from: dateStrings[0],
      to: dateStrings[1],
    }));
  };

  return (
    <LoadingWrapper loading={loading || devicesFilterLoading}>
      <div className=" flex items-center justify-between mb-3">
        <h1 className=" text-3xl font-semibold">Stats</h1>
        <FullScreenButton />
      </div>

      <div className=" flex flex-col md:flex-row justify-end gap-2 md:gap-4 mb-3">
        <div className=" flex items-end">
          <div className=" w-full">
            <p className=" text-sm mb-1">Date Range</p>
            <RangePicker
              allowClear={false}
              className="flex h-[42px] !w-full md:w-72 "
              onChange={handleRangeChange}
              value={[
                deviceFilters.from ? dayjs(deviceFilters.from) : null,
                deviceFilters.to ? dayjs(deviceFilters.to) : null
              ]}
            />
          </div>
        </div>
        <div className=" flex items-center">
          <div className=" w-full gap-3">
            <p className=" text-sm mb-1">Include Weekends</p>
            <div className=" flex justify-center">
              <Switch value={deviceFilters.includeWeekends} onChange={handleIncludeWeekends} className="mt-2" />
            </div>
          </div>
        </div>
        <div className=" flex items-end md:justify-center mt-3 md:mt-7">
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
      <div className={`${showFilters ? 'block' : 'hidden'}`}>
        <div className={`border border-gray-200 rounded-md p-6 my-5 h-full flex flex-col justify-between gap-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <p className="!mb-1 font-semibold">Organizations</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                <CustomMenu
                  handleTypeChange={(vals: string[]) => {
                    setDeviceFilters(prev => ({ ...prev, organization: vals }));
                  }}
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
                  handleTypeChange={(vals: string[]) => {
                    setDeviceFilters(prev => ({ ...prev, site: vals }));
                  }}
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
                  handleTypeChange={(vals: string[]) => {
                    setDeviceFilters(prev => ({ ...prev, building: vals }));
                  }}
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
                  handleTypeChange={(vals: string[]) => {
                    setDeviceFilters(prev => ({ ...prev, floor: vals }));
                  }}
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
          </div>
          <div className=" flex flex-row gap-3 my-2 justify-end">
            <Button danger onClick={clearFilterHandler}>Clear Filters</Button>
          </div>
        </div>
      </div>

      {
        roomData && (
          <>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataCard title="Total Occupancy" count={roomData.totalOccupancy} decimals={true} />
              <DataCard title="Total Net Useable Area" count={roomData.totalNetUseableArea} decimals={true} />
              <DataCard title="Total Max Useable Desk" count={roomData.totalMaxUseableDesks} decimals={true} />
              <DataCard title="Total Max Useable Work Station" count={roomData.totalMaxUseableWorkstations} decimals={true} />
            </div>
          </>
        )
      }
    </LoadingWrapper>
  );
};

export default withDashboardLayout(MainDataView);
