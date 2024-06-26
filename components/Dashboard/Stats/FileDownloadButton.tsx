"use client";
import React, { useState } from "react";
import { Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

interface FileDownloadButtonProps {
  from: string;
  to: string;
  deviceId: string;
}

const FileDownloadButton = ({ from, to, deviceId }: FileDownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/devices/${deviceId}/events/export`, {
        params: {
          from,
          to,
        },
      });

      if (response.status === 200) {
        setDownloadUrl(response.data.url);
        const link = document.createElement("a");
        link.href = response.data.url;
        link.setAttribute("download", "Events.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Error fetching the download URL");
      }
    } catch (error) {
      toast.error("Error fetching the download URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={handleDownload}
        disabled={loading}
        className=""
        style={{ width: '170px'}}
      >
        <span>
          {loading ? (
            <Spin size="small" className=" mr-2" />
          ) : (
            <DownloadOutlined className=" mr-2" />
          )}
          Export Events
        </span>
      </Button>
    </div>
  );
};

export default FileDownloadButton;
