import { PrimaryInput } from '@/components/ui/Input/Input';
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper';
import CustomMenu from '@/components/ui/Menu/CustomMenu';
import axiosInstance from '@/lib/axiosInstance';
import { DeviceFormType, SingleNameIdObject } from '@/type';
import { tranformObjectForSelectComponent } from '@/utils/helper_functions';
import { Card, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CreateNewRoomComponent from '../../Room/CreateNewRoomComponent';

interface DeviceFormProps {
  device: DeviceFormType;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ device }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const [formData, setFormData] = useState<DeviceFormType>(device);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    organizations: [] as SingleNameIdObject[],
    sites: [] as SingleNameIdObject[],
    buildings: [] as SingleNameIdObject[],
    floors: [] as SingleNameIdObject[],
    rooms: [] as SingleNameIdObject[],
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (url: string, key: keyof typeof data) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url);
        if (response.status === 200) {
          setData(prevData => ({ ...prevData, [key]: response.data.results }));
        } else {
          setError(true);
        }
      } catch (error: any) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCreateNewRoomModalShow = () => {
    setOpen(true)
  }

  const handleAddNewDevice = async () => {
    const requiredFields = ['oem', 'name', 'description', 'organization', 'site', 'building', 'floor', 'room'];

    for (const field of requiredFields) {
      if ((formData as any)[field] === '') {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/devices', formData);
      if (response.status === 200) {
        toast.success('Device added successfully');
        router.push('/dashboard/devices');
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('/organizations', 'organizations');
  }, [fetchData]);

  useEffect(() => {
    if (formData.organization) {
      fetchData(`/organizations/${formData.organization}/sites`, 'sites');
    }
  }, [formData.organization, fetchData]);

  useEffect(() => {
    if (formData.site) {
      fetchData(`/sites/${formData.site}/buildings`, 'buildings');
    }
  }, [formData.site, fetchData]);

  useEffect(() => {
    if (formData.building) {
      fetchData(`/buildings/${formData.building}/floors`, 'floors');
    }
  }, [formData.building, fetchData]);

  useEffect(() => {
    if (formData.floor) {
      fetchData(`/floors/${formData.floor}/rooms`, 'rooms');
    }
  }, [formData.floor, fetchData]);

  const organizationsOptions = tranformObjectForSelectComponent(data.organizations);
  const sitesOptions = tranformObjectForSelectComponent(data.sites);
  const buildingsOptions = tranformObjectForSelectComponent(data.buildings);
  const floorsOptions = tranformObjectForSelectComponent(data.floors);
  const roomsOptions = tranformObjectForSelectComponent(data.rooms);

  const renderCustomMenu = (label: string, value: keyof DeviceFormType, options: any, isAdmin: boolean) => (
    <div className="h-[100px]">
      <p className="!mb-1 font-semibold">{label}</p>
      <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0 h-[48px]">
        <CustomMenu
          handleTypeChange={(val: string) => setFormData({ ...formData, [value]: val })}
          isAdmin={isAdmin}
          options={options}
          initialValue={formData[value] as string}
          createNewRoom={value === 'room'}
          handleCreateNewRoomModalShow={value === 'room' ? handleCreateNewRoomModalShow : undefined}
        />
      </div>
    </div>
  );

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <>
      <LoadingWrapper loading={loading}>
        <Card>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='p-0 md:p-3'>
              <div className='max-w-[700px] flex flex-col gap-3'>
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

                <div className=''>
                  <p className="!mb-1 font-semibold">Type</p>
                  <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0 h-[48px]">
                    <CustomMenu
                      handleTypeChange={(value: string) => setFormData({ ...formData, type: value })}
                      isAdmin={true}
                      options={[{ value: 'motion', label: 'Motion' }]}
                      initialValue={'motion'}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-3 p-0 md:p-3'>
              {renderCustomMenu("Organization", "organization", organizationsOptions, true)}
              {renderCustomMenu("Site", "site", sitesOptions, formData.organization !== '')}
              {renderCustomMenu("Building", "building", buildingsOptions, formData.site !== '')}
              {renderCustomMenu("Floor", "floor", floorsOptions, formData.building !== '')}
              {renderCustomMenu("Room", "room", roomsOptions, formData.floor !== '')}
            </div>
          </div>
          <div>
            <div className='flex justify-end mt-4'>
              <span
                onClick={handleAddNewDevice}
                className="inline-block cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 gap-2 items-center"
              >
                Add New Device
              </span>
            </div>
          </div>
        </Card>
      </LoadingWrapper>
      <Modal
        title="Create New Room"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Create New Room'
        width={1000}
      >
        <CreateNewRoomComponent />
      </Modal>
    </>
  );
};

export default DeviceForm;
