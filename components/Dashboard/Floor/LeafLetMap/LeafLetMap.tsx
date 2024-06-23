"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, FeatureGroup } from "react-leaflet";
import { Icon, LatLngBoundsExpression } from "leaflet";
import axiosInstance from "@/lib/axiosInstance";
import DeviceDetailsComp from "../../DeviceDetailsComp";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./leaflet.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setDevicesStats } from "@/app/store/slice/StatisticsSlice";
import { DevicesType } from "@/type";
import { EditControl } from "react-leaflet-draw"
import { iconsBasedOnType } from "@/utils/helper_functions";

interface LeafLetMapProps {
  diagram?: string;
  fullScreen?: boolean
}

const LeafLetMap: React.FC<LeafLetMapProps> = ({ diagram, fullScreen }) => {
  const devicesStats = useSelector(
    (state: RootState) => state.statisticsReducer
  );
  const [devices, setDevices] = useState<DevicesType[]>([]);
  const [events, setEvents] = useState<DevicesType[]>([]);
  const { token } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/devices?page=1&limit=50");
        if (response.status === 200) {
          setDevices(response.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    let abortController = new AbortController();
    let xhr: XMLHttpRequest;

    const connect = () => {
      abortController = new AbortController();
      xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        "https://api.sedaems.originsmartcontrols.com/v1/events/stream",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3) {
          // The response is streaming
          const text = xhr.responseText;
          const eventsArray = text
            .split("\n")
            .filter((line) => line.trim() !== "" && line.startsWith("data: "))
            .map((line) => {
              const jsonString = line.substring(6);
              try {
                return JSON.parse(jsonString);
              } catch (error) {
                console.error("JSON parse error:", error, jsonString);
                return null;
              }
            })
            .filter((event): event is DevicesType => event !== null);

          setEvents((prevEvents) => [...prevEvents, ...eventsArray]);
        }
      };

      xhr.onerror = () => {
        console.error("Fetch error:", xhr.statusText);
        reconnect();
      };

      xhr.send(
        JSON.stringify({
          /* Add any required body data here */
        })
      );
    };

    const reconnect = () => {
      setTimeout(() => {
        connect();
      }, 1000);
    };

    connect();

    return () => {
      if (xhr) xhr.abort();
      abortController.abort();
    };
  }, [token]);

  useEffect(() => {
    const recentEvent = events.at(-1);
    if (recentEvent) {
      setDevices((prevState) =>
        prevState.map((device) => {
          if (recentEvent.oem === device.oem) {
            const updatedDevice = {
              ...device,
              temperature: recentEvent.temperature,
              relativeHumidity: recentEvent.relativeHumidity,
            };

            toast.success("Got the latest data for " + device.name);
            return updatedDevice;
          }
          return device;
        })
      );
    }
  }, [events]);

  useEffect(() => {
    if (devices.length > 0) {
      const maxTemperature = Math.max(
        ...devices.map((device) => device.temperature)
      );
      const maxRelativeHumidity = Math.max(
        ...devices.map((device) => device.relativeHumidity)
      );

      if (
        devicesStats.highestTemperature < maxTemperature ||
        devicesStats.highestRelativeHumidity < maxRelativeHumidity
      ) {
        const updatedStats = {
          totalDevices: devicesStats.totalDevices,
          highestTemperature: maxTemperature,
          highestRelativeHumidity: maxRelativeHumidity,
        };
        dispatch(setDevicesStats(updatedStats));
      }
    }
  }, [dispatch, devices, devicesStats]);

  const imageUrl = diagram || "/seda-ground-floor.jpg";

  const bounds: LatLngBoundsExpression = [
    [51.5008, -0.0839],
    [51.5019, -0.082],
  ];

  const getMarkerIcons = (key: string) => {
    return new Icon({
      iconUrl: iconsBasedOnType(key),
      iconSize: [22, 22],
    })
  }

  return (
    <div
      style={{ width: "100%" }}
      className={`w-full ${fullScreen ? 'h-screen' : 'h-[500px] md:max-h-[670px] 2xl:h-[900px]'}`}
    >
      <MapContainer
        center={[51.5014, -0.083]}
        zoom={fullScreen ? 20 : 19}
        minZoom={19}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      >
        <ImageOverlay url={imageUrl} bounds={bounds} />

        {devices.map((device) => (
          <Marker
            key={device.oem}
            position={[device.location.lat, device.location.long]}
            icon={getMarkerIcons(device.type)}
          >
            <Popup>
              <DeviceDetailsComp device={device} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafLetMap;
