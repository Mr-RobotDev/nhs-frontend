'use client'
import React, { useEffect, useState } from 'react';
import SingleAlertDetailsView from '@/components/Dashboard/alerts/SingleAlertDetailsView';
import { AlertDataType, DevicesType } from '@/type';
import axiosInstance from '@/lib/axiosInstance';
import { Spin } from 'antd';
import withDashboardLayout from '@/hoc/withDashboardLayout';

const fetchAlertRecord = async (id: string) => {
  const response = await axiosInstance.get(`/alerts/${id}`)
  return response.data
};

interface SingleAlertProps {
  id: string;
}

const SingleAlert = ({ id }: SingleAlertProps) => {

  const [alert, setAlert] = useState<AlertDataType>()
  const [device, setDevice] = useState<DevicesType>()

  useEffect(() => {
    (async () => {
      try {
        const alertRecord = await fetchAlertRecord(id);
        setAlert(alertRecord)
        setDevice(alertRecord.device)
      } catch (error) {
        console.log('Error->', error);
      }
    })()
  }, [id])

  if (!alert || !device) {
    return (
      <div className=' w-full h-full flex justify-center items-center'>
        <Spin />
      </div>
    )
  }


  return (
    <div>
      {alert && device && <SingleAlertDetailsView alert={alert} device={device} creatingNewAlert={false} />}
    </div>
  );
};

export default withDashboardLayout(SingleAlert);
