"use client";
import React from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesTable from "./DevicesTable";
import { Card } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const DeviceMainView = () => {
  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  return (
    <Card>
      <div className=" flex flex-row justify-between items-center">
        <h1 className=" text-3xl font-semibold">Devices</h1>
        {isAdmin && <Link href={'/dashboard/devices/create'} className="flex justify-center mt-3">
          <span
            className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-custom-nhs-blue text-white hover:bg-blue-600 transition-all ease-in-out duration-300 flex gap-2 items-center"
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Add New Device
          </span>
        </Link>}
      </div>
      <DevicesTable />
    </Card>
  );
};

export default withDashboardLayout(DeviceMainView);
