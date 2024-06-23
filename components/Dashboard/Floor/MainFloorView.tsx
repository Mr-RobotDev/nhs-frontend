"use client";
import { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import DevicesStats from "./DevicesStats";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { Card, Col, Row, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setDevicesStats } from "@/app/store/slice/StatisticsSlice";
import { RootState } from "@/app/store/store";
import DeviceStatsPieChart from "./DeviceStatsPieChart";
import FullScreenButton from "@/components/ui/FullScreenButton/FullScreenButton";
import { RoomStatsType } from "@/type";
import RoomStatsPieChart from "./RoomStatsPieChart";

const MainFloorView = () => {
  const dispatch = useDispatch();
  const deviceStats = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  const [error, setError] = useState(false);
  const [roomStats, setRoomStats] = useState<RoomStatsType>({ totalRooms: 0, red: 0, yellow: 0, green: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deviceResponse, roomResponse] = await Promise.all([
          axiosInstance.get("/devices/stats"),
          axiosInstance.get("/rooms/stats"),
        ]);

        if (deviceResponse.status === 200 && roomResponse.status === 200) {
          dispatch(setDevicesStats(deviceResponse.data));
          setRoomStats(prevStats => ({
            ...prevStats,
            ...roomResponse.data,
          }));
        } else {
          setError(true);
          toast.error("Error fetching device or room stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(true);
        toast.error("Error fetching device or room stats");
      }
    };

    fetchData();
  }, [dispatch]);


  return (
    <>
      <div className=" flex items-center justify-between mb-3">
        <h1 className=" text-3xl font-semibold">Floor Plan</h1>
        <FullScreenButton />
      </div>
      {error ? (
        <h1 className=" text-2xl font-semibold mt-20 text-center">
          Error Loading the Resources
        </h1>
      ) : (
        <div>
          {deviceStats.totalDevices === 0 ? (
            <div className="  w-full h-full flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <DevicesStats roomStats={roomStats} />
              <Row className="rowgap-vbox" gutter={[24, 0]}>

                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Card className="!p-0">
                    <h2 className=" text-xl font-semibold">Devices Status</h2>
                    <DeviceStatsPieChart />
                  </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Card className="!p-0">
                    <h2 className=" text-xl font-semibold">Rooms Status</h2>
                    {roomStats && <RoomStatsPieChart roomStats={roomStats} />}
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default withDashboardLayout(MainFloorView);
