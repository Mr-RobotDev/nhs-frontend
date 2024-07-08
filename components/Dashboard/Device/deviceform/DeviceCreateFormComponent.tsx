'use client'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import React from 'react'
import DeviceForm from './DeviceForm'
import { DeviceFormType } from '@/type'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const DeviceCreateFormComponent = () => {
  const device: DeviceFormType = {
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
      <Link className=' inline-block' href='/dashboard/devices'>
        <span className=' flex flex-row gap-2 text-blue-400 cursor-pointer'><ArrowLeftIcon width={15} /> Back to Devices</span>
      </Link>
      <h1 className=' text-2xl font-semibold'>Create New Device</h1>
      <DeviceForm device={device} />
    </div>
  )
}

export default withDashboardLayout(DeviceCreateFormComponent)