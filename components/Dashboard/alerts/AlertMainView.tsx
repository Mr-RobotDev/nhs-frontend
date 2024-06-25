'use client'
import React from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import AlertsTable from './AlertsTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'

const AlertMainView = () => {
  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  return (
    <>
      <div className=' flex mb-8 flex-row items-center justify-between'>
        <h1 className=" text-3xl font-semibold !mb-0">Alerts</h1>
        {isAdmin && <Link href={'/dashboard/alerts/create'} className="flex justify-center mt-3">
          <span
            className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-custom-nhs-blue text-white hover:bg-blue-600 transition-all ease-in-out duration-300 flex gap-2 items-center"
          >
            <FontAwesomeIcon icon={faCirclePlus} />
            Create New Alert
          </span>
        </Link>}
      </div>
      <AlertsTable />
    </>
  )
}

export default withDashboardLayout(AlertMainView)