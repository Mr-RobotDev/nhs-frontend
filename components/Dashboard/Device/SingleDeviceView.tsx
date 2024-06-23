"use client";
import React from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DeviceGraph from "./DeviceGraph";

interface SingleDeviceViewProps {
  id: string;
}
const SingleDeviceView = ({ id }: SingleDeviceViewProps) => {
  return (
    <>
      <div className=" h-96">
        <DeviceGraph id={id} />
      </div>
    </>
  );
};

export default withDashboardLayout(SingleDeviceView);
