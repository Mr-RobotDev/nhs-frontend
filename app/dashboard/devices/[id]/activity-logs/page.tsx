import React from 'react'
import DeviceActivityLogView from '@/components/Dashboard/Device/ActivityLog/DeviceActivityLogView'
import { cookies } from 'next/headers'

export async function generateMetadata(props: any) {
  const { id } = props.params;
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  const response = await fetch(`https://api.nhs.originsmartcontrols.com/v1/devices/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token?.value}`
    }
  });

  const data = await response.json();
  const title = `${data.name}`;

  return {
    title: `Activity Logs - ${title}`,
  };
}

const DeviceActivityLogs = (props: any) => {
  const { id } = props.params
  return id && <DeviceActivityLogView id={id} />
}

export default DeviceActivityLogs