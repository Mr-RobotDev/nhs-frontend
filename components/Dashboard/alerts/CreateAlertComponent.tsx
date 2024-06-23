'use client'
import React from 'react'
import { RootState } from '@/app/store/store'
import { AlertDataType, DevicesType } from '@/type'
import { useSelector } from 'react-redux'
import SingleAlertDetailsView from '@/components/Dashboard/alerts/SingleAlertDetailsView'
import withDashboardLayout from '@/hoc/withDashboardLayout'

const CreateAlertComponent = () => {
  const { user } = useSelector((state: RootState) => state.authReducer)
  const alert: AlertDataType = {
    name: '',
    device: '',
    recipients: [user.email],
    trigger: {
      field: 'temperature',
      range: {
        lower: 0,
        upper: 0,
        type: 'lower'
      },
      duration: 0
    },
    scheduleType: 'weekdays',
    weekdays: [],
    enabled: false,
    id: ''
  }

  const device: DevicesType = {
    id: '',
    oem: '',
    name: '',
    type: '',
    temperature: 0,
    relativeHumidity: 0,
    location: {
      lat: 0,
      long: 0
    },
    signalStrength: 0,
    lastUpdated: '',
    isOffline: false
  }

  return (
    <SingleAlertDetailsView alert={alert} device={device} creatingNewAlert={true} />
  )
}

export default withDashboardLayout(CreateAlertComponent)