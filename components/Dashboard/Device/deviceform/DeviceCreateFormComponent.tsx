'use client'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import React from 'react'
import DeviceForm from './DeviceForm'
import { DeviceFormType } from '@/type'

const DeviceCreateFormComponent = () => {
  const device: DeviceFormType ={
    oem: '',
    name: '',
    description: '',
    type: 'motion',
    organization: '',
    site: '',
    building: '',
    floor: '',
    room: ''
  }

  return (
    <div>
      <h1 className=' text-2xl font-semibold'>Create New Device</h1>
      <DeviceForm device={device} />
    </div>
  )
}

export default withDashboardLayout(DeviceCreateFormComponent)