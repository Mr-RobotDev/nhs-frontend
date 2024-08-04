'use client'
import axiosInstance from '@/lib/axiosInstance';
import { roomsDataTableType } from '@/type';
import { convertObjectToQueryString } from '@/utils/helper_functions';
import { Table, TableProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'

interface RoomsDataTableProps {
  globalFilters: {
    organization: string[],
    site: string[],
    building: string[],
    floor: string[],
    room: string[],
    includeWeekends: boolean,
    from: string,
    to: string,
  }
}

const RoomsDataTable: React.FC<RoomsDataTableProps> = ({ globalFilters }) => {
  const [loading, setLoading] = useState(false);
  const [roomsTableData, setRoomsTableData] = useState<roomsDataTableType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState(globalFilters);

  const fetchRoomStats = useCallback(async (filters: any, page: number, limit: number) => {
    const { from, to, ...newFilters } = filters;

    const queryParams = convertObjectToQueryString(
      {
        ...newFilters,
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
        page,
        limit,
      }
    );

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/rooms/data-table?${queryParams}`);
      if (response.status === 200) {
        setRoomsTableData(response.data.results);
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

  // Reset the page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setFilters(globalFilters); // Update the filters state when globalFilters change
  }, [globalFilters]);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchRoomStats(filters, currentPage, pageSize);
  }, [filters, fetchRoomStats, currentPage, pageSize]);

  let columns: TableProps<roomsDataTableType>["columns"] = [
    {
      title: "ORGANIZATION",
      render: (_, { organization }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{organization}</p>
        </div>
      ),
    },
    {
      title: "SITE",
      render: (_, { site }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{site}</p>
        </div>
      ),
    },
    {
      title: "BUILDING",
      render: (_, { building }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{building}</p>
        </div>
      ),
    },
    {
      title: "FLOOR CODE",
      render: (_, { code }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{code}</p>
        </div>
      ),
    },
    {
      title: "FLOOR NAME",
      render: (_, { floor }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{floor}</p>
        </div>
      ),
    },
    {
      title: "NET USEABLE AREA",
      render: (_, { netUseableArea }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{netUseableArea}</p>
        </div>
      ),
    },
    {
      title: "MAX DESK OCCUPATION",
      render: (_, { maxDeskOccupation }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{maxDeskOccupation}</p>
        </div>
      ),
    },
    {
      title: "NUM WORK STATIONS",
      render: (_, { numWorkstations }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          <p className=" !text-black">{numWorkstations}</p>
        </div>
      ),
    },
    {
      title: "OCCUPANCY",
      render: (_, { occupancy }) => (
        <div className=" w-36 md:w-full whitespace-normal flex flex-row items-center">
          {occupancy ? <p className=" !text-black">{occupancy.toFixed(2)}</p>: <p>-</p>}
        </div>
      ),
    },
  ];

  const handleTableChange = (newPageNumber: number) => {
    setCurrentPage(newPageNumber);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={roomsTableData}
        scroll={{ x: 500 }}
        loading={loading}
        className="cursor-pointer"
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

export default RoomsDataTable;
