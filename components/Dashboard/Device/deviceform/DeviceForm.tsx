import { PrimaryInput } from '@/components/ui/Input/Input'
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper'
import CustomMenu from '@/components/ui/Menu/CustomMenu'
import axiosInstance from '@/lib/axiosInstance'
import { DeviceFormType, SingleNameIdObject } from '@/type'
import { triggerWhenOptions } from '@/utils/form'
import { tranformObjectForSelectComponent } from '@/utils/helper_functions'
import { Card, Form, Input, Select } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'


interface DeviceFormProps {
  device: DeviceFormType
}

const DeviceForm: React.FC<DeviceFormProps> = ({ device }) => {
  const [formData, setFormData] = useState<DeviceFormType>(device)
  const [error, setError] = useState(false)
  const [organizations, setOrganizations] = useState<SingleNameIdObject[]>([])
  const [sites, setSites] = useState<SingleNameIdObject[]>([])
  const [buildings, setBuildings] = useState<SingleNameIdObject[]>([])
  const [floors, setFloors] = useState<SingleNameIdObject[]>([])
  const [rooms, setRooms] = useState<SingleNameIdObject[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/organizations`);
      if (response.status === 200) {
        setOrganizations(response.data.results);
      } else {
        setError(true);
      }
    } catch (error: any) {
      console.log(error);
      setError(true);

    } finally {
      setLoading(false)
    }
  }, []);

  const fetchSites = useCallback(async (orgId: string) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/organizations/${orgId}/sites`);
      if (response.status === 200) {
        setSites(response.data.results);
      } else {
        setError(true);
      }
    } catch (error: any) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchBuildings = useCallback(async (siteId: string) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/sites/${siteId}/buildings`);
      if (response.status === 200) {
        setBuildings(response.data.results);
      } else {
        setError(true);
      }
    } catch (error: any) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchFloors = useCallback(async (buildingId: string) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/buildings/${buildingId}/floors`);
      if (response.status === 200) {
        setFloors(response.data.results);
      } else {
        setError(true);
      }
    } catch (error: any) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchRooms = useCallback(async (foorsId: string) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/floors/${foorsId}/rooms`);
      if (response.status === 200) {
        setRooms(response.data.results);
      } else {
        setError(true);
      }
    } catch (error: any) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddNewDevice = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.post('/devices', formData)
      if (response.status === 200) {
        toast.success('Device added successfully')
        router.push('/dashboard/devices')
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    if (formData.organization) {
      fetchSites(formData.organization)
    }
  }, [formData.organization, fetchSites])

  useEffect(() => {
    if (formData.site) {
      fetchBuildings(formData.site)
    }
  }, [formData.site, fetchBuildings])

  useEffect(() => {
    if (formData.building) {
      fetchFloors(formData.building)
    }
  }, [fetchFloors, formData.building])

  useEffect(() => {
    if (formData.floor) {
      fetchRooms(formData.floor)
    }
  }, [formData.floor, fetchRooms])

  const organizationsOptions = tranformObjectForSelectComponent(organizations)
  const sitesOptions = tranformObjectForSelectComponent(sites)
  const buildingsOptions = tranformObjectForSelectComponent(buildings)
  const floorsOptions = tranformObjectForSelectComponent(floors)
  const roomsOptions = tranformObjectForSelectComponent(rooms)

  return (
    <LoadingWrapper loading={loading}>
      <Card>
        <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className=' p-3'>
            <div className=' max-w-[700px] flex flex-col gap-3'>
              <div className="flex-1">
                <p className="font-semibold !text-sm !mb-1">OEM</p>
                <PrimaryInput
                  name="oem"
                  value={formData.oem}
                  onChange={(e) => setFormData({ ...formData, oem: e.target.value })}
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold !text-sm !mb-1">Name</p>
                <PrimaryInput
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold !text-sm !mb-1">Description</p>
                <PrimaryInput
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold !text-sm !mb-1">Type</p>
                <PrimaryInput
                  name="type"
                  value={formData.type}
                  className=' capitalize'
                  onChange={(e) => setFormData({ ...formData, type: 'motion' })}
                />
              </div>
            </div>
          </div>
          <div className=' grid grid-cols-2 gap-4'>
            <div className=' h-[100px]'>
              <p className="!mb-1 font-semibold">Organization</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0  h-[48px]">
                <CustomMenu
                  handleTypeChange={(value: string) => setFormData({ ...formData, organization: value })}
                  isAdmin={true}
                  options={organizationsOptions}
                  initialValue={formData.organization}
                />
              </div>
            </div>
            <div className=' h-[100px]'>
              <p className="!mb-1 font-semibold">Sites</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0 h-[48px]">
                <CustomMenu
                  handleTypeChange={(value: string) => setFormData({ ...formData, site: value })}
                  isAdmin={formData.organization !== ''}
                  options={sitesOptions}
                  initialValue={formData.site}
                />
              </div>
            </div>
            <div className=' h-[100px]'>
              <p className="!mb-1 font-semibold">Buildings</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0 h-[48px]">
                <CustomMenu
                  handleTypeChange={(value: string) => setFormData({ ...formData, building: value })}
                  isAdmin={formData.site !== ''}
                  options={buildingsOptions}
                  initialValue={formData.building}
                />
              </div>
            </div>
            <div className=' h-[100px]'>
              <p className="!mb-1 font-semibold">Floors</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0 h-[48px]">
                <CustomMenu
                  handleTypeChange={(value: string) => setFormData({ ...formData, floor: value })}
                  isAdmin={formData.building !== ''}
                  options={floorsOptions}
                  initialValue={formData.floor}
                />
              </div>
            </div>
            <div className=' h-[100px]'>
              <p className="!mb-1 font-semibold">Rooms</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0 h-[48px]">
                <CustomMenu
                  handleTypeChange={(value: string) => setFormData({ ...formData, room: value })}
                  isAdmin={formData.floor !== ''}
                  options={roomsOptions}
                  initialValue={formData.room}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex justify-end mt-4 '>
            <span
              onClick={handleAddNewDevice}
              className=" inline-block cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 gap-2 items-center"
            >
              Add New Device
            </span>
          </div>
        </div>
      </Card>
    </LoadingWrapper>
  )
}

export default DeviceForm