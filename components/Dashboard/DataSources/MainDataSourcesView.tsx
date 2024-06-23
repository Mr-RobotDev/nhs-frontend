'use client'
import Image from 'next/image'
import React from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'

const MainDataSourcesView = () => {
  return (
    <>
      <h1 className=" text-3xl font-semibold">Data Source</h1>
      <div className=" flex justify-center items-center">
        <div className="">
          <Image src='/data-source.gif' alt="Comming Soon" className=" w-full h-full" width={100} height={100} />
        </div>
      </div>
    </>
  )
}

export default withDashboardLayout(MainDataSourcesView)