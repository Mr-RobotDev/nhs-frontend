"use client";
import { RootState } from "@/app/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DeviceLocation {
  lat: number;
  long: number;
}

interface DeviceEvent {
  oem: string;
  name: string;
  type: string;
  temperature: number;
  relativeHumidity: number;
  location: DeviceLocation;
}

const EventStream: React.FC = () => {
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const { token } = useSelector((state: RootState) => state.authReducer);

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
            .filter((event) => event !== null);

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

  return (
    <div>
      <h1>Event Stream</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <p>
              Temperature: <strong>{event.temperature}</strong>
            </p>
            <p>
              Relative Humidity: <strong>{event.relativeHumidity}</strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventStream;
