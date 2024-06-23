import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SensorSelectComponent from "./SensorSelectComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface SensorSelectorProps {
  selectedSensors: string[];
  setSelectedSensors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRowKeys: React.Key[];
}

const SensorSelector = ({
  selectedRowKeys,
  selectedSensors,
  setSelectedSensors,
}: SensorSelectorProps) => {
  const { devices } = useSelector((state: RootState) => state.devicesReducer)
  const [isPressureDevice, setIsPressureDevice] = useState(false)
  useEffect(() => {
    if (devices.length > 0) {
      const pressureDevices = devices.filter(device => device.type === 'pressure').map(device => device.id)
      const selectedRowKeysSet = new Set(selectedRowKeys);
      setIsPressureDevice(pressureDevices.some(item => selectedRowKeysSet.has(item)))
    }
  }, [devices, selectedRowKeys])
  const handleClick = (field: string) => {
    if (
      selectedRowKeys.length > 1 &&
      selectedSensors.length === 1 &&
      !selectedSensors.includes(field)
    ) {
      toast.error("Cannot select Multiple Sensors for more than one devices");
      return;
    }

    setSelectedSensors((prevSensors) => {
      if (prevSensors.includes(field)) {
        return prevSensors.filter((sensor) => sensor !== field);
      } else {
        return [...prevSensors, field];
      }
    });
  };

  useEffect(() => {
    setSelectedSensors([]);
  }, [selectedRowKeys, setSelectedSensors]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      {
        isPressureDevice ? <SensorSelectComponent title="Pressue" sensorType="pressure" handleClick={handleClick} selectedSensors={selectedSensors} />
          :
          <>
            <SensorSelectComponent title="Temperature" sensorType="temperature" handleClick={handleClick} selectedSensors={selectedSensors} />
            <SensorSelectComponent title="Relative Humidity" sensorType="relativeHumidity" handleClick={handleClick} selectedSensors={selectedSensors} />
          </>
      }
    </div>
  );
};

export default SensorSelector;
