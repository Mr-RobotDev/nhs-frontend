import SingleDeviceView from "@/components/Dashboard/Device/SingleDeviceView"
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from 'next/headers'

export async function generateMetadata(props: any) {
  const { id } = props.params;
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  const response = await fetch(`https://api.sedaems.originsmartcontrols.com/v1/devices/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token?.value}`
    }
  });

  const data = await response.json();
  const title = `${data.name}`;

  return {
    title: title,
  };
}


const DevicePage = (props: any) => {
  const { id } = props.params

  return id && <SingleDeviceView id={id} />

}

export default DevicePage