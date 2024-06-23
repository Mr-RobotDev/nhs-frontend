"use client";
import React from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesTable from "./DevicesTable";
import { Card } from "antd";

const DeviceMainView = () => {
  return (
    <Card>
      <h1 className=" text-3xl font-semibold">Devices</h1>
      <DevicesTable />
    </Card>
  );
};

export default withDashboardLayout(DeviceMainView);
