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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { setNewRoom } from '@/app/store/slice/roomSlice';
import { emptyRoomObject } from '@/utils/form';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface DeviceFormProps {
  device: DeviceFormType;
}

const schema = yup.object().shape({
  oem: yup.string().required('OEM is required'),
  name: yup.string().required('Name is required'),
  type: yup.string().required('type is required'),
  description: yup.string().required('Description is required'),
  organization: yup.string().required('Organization is required'),
  site: yup.string().required('Site is required'),
  building: yup.string().required('Building is required'),
  floor: yup.string().required('Floor is required'),
  room: yup.string().required('Room is required'),
});

const DeviceForm: React.FC<DeviceFormProps> = ({ device }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const { room: roomFromGlobalState } = useSelector((state: RootState) => state.roomReducer);
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
  const dispatch = useDispatch();

  const { register, handleSubmit, control, formState: { errors }, trigger } = useForm<DeviceFormType>({
    resolver: yupResolver(schema),
    defaultValues: device,
  });

  const fetchData = useCallback(
    async (url: string, key: keyof typeof data, queryparams: any) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url, {
          params: {
            limit: 10,
            page: 1,
            ...queryparams
          }
        });
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
    setOpen(true);
  };

  const handleAddNewDevice = async (data: DeviceFormType) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/devices', data);
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
    fetchData('/organizations', 'organizations', {});
  }, [fetchData]);

  useEffect(() => {
    if (formData.organization) {
      fetchData(`/sites`, 'sites', { organization: formData.organization });
    }
  }, [formData.organization, fetchData]);

  useEffect(() => {
    if (formData.site) {
      fetchData(`/buildings`, 'buildings', { site: formData.site });
    }
  }, [formData.site, fetchData]);

  useEffect(() => {
    if (formData.building) {
      fetchData(`/floors`, 'floors', { building: formData.building });
    }
  }, [formData.building, fetchData]);

  useEffect(() => {
    if (formData.floor) {
      fetchData(`/rooms`, 'rooms', { floor: formData.floor });
    }
  }, [formData.floor, fetchData]);

  useEffect(() => {
    if (roomFromGlobalState.id !== '') {
      const newOption = {
        id: roomFromGlobalState.id,
        name: roomFromGlobalState.name,
      };
  
      setData((prevData: any) => ({
        ...prevData,
        rooms: [...prevData.rooms, newOption],
      }));
  
      setFormData((prevState: any) => ({
        ...prevState,
        room: roomFromGlobalState.id,
      }));

      trigger();
    }
  
    return () => {
      dispatch(setNewRoom(emptyRoomObject));
    };
  }, [roomFromGlobalState, dispatch, trigger]);
  

  const organizationsOptions = tranformObjectForSelectComponent(data.organizations);
  const sitesOptions = tranformObjectForSelectComponent(data.sites);
  const buildingsOptions = tranformObjectForSelectComponent(data.buildings);
  const floorsOptions = tranformObjectForSelectComponent(data.floors);
  const roomsOptions = tranformObjectForSelectComponent(data.rooms);

  const renderCustomMenu = (label: string, value: keyof DeviceFormType, options: any, isAdmin: boolean, placeholder: string) => (
    <div className="h-[100px]">
      <p className="!mb-1 font-semibold">{label}</p>
      <Controller
        name={value}
        control={control}
        render={({ field }) => (
          <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
            <CustomMenu
              handleTypeChange={(vals: string[]) => {
                const selectedValue = vals[0];
                field.onChange(selectedValue);
                setFormData({ ...formData, [value]: selectedValue });
              }}
              isAdmin={isAdmin}
              options={options}
              initialValue={formData[value].length > 0 ? [formData[value]] : []}
              createNewRoom={value === 'room'}
              handleCreateNewRoomModalShow={value === 'room' ? handleCreateNewRoomModalShow : undefined}
              multiple={false}
              placeholderText={placeholder}
            />
          </div>
        )}
      />
      {errors[value] && <p className="!text-red-500 text-xs mt-1">{(errors[value] as any)?.message}</p>}
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
          <form onSubmit={handleSubmit(handleAddNewDevice)}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='p-0 md:p-3'>
                <div className='max-w-[700px] flex flex-col gap-3'>
                  <div className="flex-1">
                    <p className="font-semibold !text-sm !mb-1">OEM</p>
                    <Controller
                      name="oem"
                      control={control}
                      render={({ field }) => (
                        <PrimaryInput placeholder='Enter the OEM' {...field} />
                      )}
                    />
                    {errors.oem && <p className="!text-red-500 text-xs mt-1">{errors.oem.message}</p>}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold !text-sm !mb-1">Name</p>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <PrimaryInput placeholder='Enter the Name of the Device' {...field} />
                      )}
                    />
                    {errors.name && <p className="!text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold !text-sm !mb-1">Description</p>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <PrimaryInput placeholder='Enter the description' {...field} />
                      )}
                    />
                    {errors.description && <p className="!text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  <div className=''>
                    <p className="!mb-1 font-semibold">Type</p>
                    <div className="flex flex-row items-center border rounded-md shadow-md lg:mb-3 md:mb-0">
                      <CustomMenu
                        handleTypeChange={(vals: string[]) => {
                          const selectedValue = vals[0];
                          setFormData({ ...formData, type: selectedValue });
                        }}
                        isAdmin={true}
                        options={[{ value: 'motion', label: 'Motion' }]}
                        initialValue={['motion']}
                        multiple={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-3 p-0 md:p-3'>
                {renderCustomMenu("Organization", "organization", organizationsOptions, true, 'Select the organization')}
                {renderCustomMenu("Site", "site", sitesOptions, formData.organization !== '',  'Select the site')}
                {renderCustomMenu("Building", "building", buildingsOptions, formData.site !== '', 'Select the building')}
                {renderCustomMenu("Floor", "floor", floorsOptions, formData.building !== '', 'Select the floor')}
                {renderCustomMenu("Room", "room", roomsOptions, formData.floor !== '', 'Select the room')}
              </div>
            </div>
            <div>
              <div className='flex justify-end mt-4'>
                <button
                  type="submit"
                  className="inline-block cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-custom-nhs-blue text-white hover:bg-blue-600 transition-all ease-in-out duration-300 gap-2 items-center"
                >
                  Add New Device
                </button>
              </div>
            </div>
          </form>
        </Card>
      </LoadingWrapper>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Create New Room'
        width={1000}
        footer={null}
      >
        <CreateNewRoomComponent 
          organizationId={formData.organization}
          siteId={formData.site}
          buildingId={formData.building} 
          floorId={formData.floor} 
          setOpen={setOpen} />
      </Modal>
    </>
  );
};

export default DeviceForm;
