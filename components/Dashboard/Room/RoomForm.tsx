import { setNewRoom } from '@/app/store/slice/roomSlice';
import { PrimaryInput } from '@/components/ui/Input/Input';
import LoadingWrapper from '@/components/ui/LoadingWrapper/LoadingWrapper';
import axiosInstance from '@/lib/axiosInstance';
import { RoomFormType } from '@/type';
import { Button } from 'antd';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface RoomFormProps {
  room: RoomFormType;
  floorId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = yup.object().shape({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
  function: yup.string().required('Function is required'),
  netUseableArea: yup.number().required('Net Useable Area is required'),
  department: yup.string().required('Department is required'),
  division: yup.string().required('Division is required'),
  cluster: yup.string().required('Cluster is required'),
  clusterDescription: yup.string().required('Cluster Description is required'),
  operationHours: yup.string().required('Operation Hours is required'),
  hoursPerDay: yup.number().required('Hours Per Day is required'),
  organization: yup.string().required('Organization is required'),
  building: yup.string().required('Building is required'),
  site: yup.string().required('Site is required'),
});

const RoomForm: React.FC<RoomFormProps> = ({ room, floorId, setOpen }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, control, formState: { errors } } = useForm<RoomFormType>({
    resolver: yupResolver(schema),
    defaultValues: room,
  });

  const [loading, setLoading] = useState(false);

  const handleCreateNewRoom = async (data: RoomFormType) => {
    try {
      setLoading(true);

      data.netUseableArea = parseFloat(data.netUseableArea.toString());
      data.hoursPerDay = parseInt(data.hoursPerDay.toString());

      const response = await axiosInstance.post(`floors/${floorId}/rooms`, data);
      if (response.status === 201) {
        toast.success('Room created successfully');
        dispatch(setNewRoom(response.data));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log(data);
  };

  return (
    <LoadingWrapper loading={loading}>
      <h1 className='text-2xl font-semibold'>Add New Room Details</h1>
      <form onSubmit={handleSubmit(handleCreateNewRoom)}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Code</p>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.code && <p className="!text-red-500 text-xs mt-1">{errors.code.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Name</p>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.name && <p className="!text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Function</p>
              <Controller
                name="function"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.function && <p className="!text-red-500 text-xs mt-1">{errors.function.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Net Useable Area </p>
              <Controller
                name="netUseableArea"
                control={control}
                render={({ field }) => (
                  <PrimaryInput type="number" {...field} />
                )}
              />
              {errors.netUseableArea && <p className="!text-red-500 text-xs mt-1">{errors.netUseableArea.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Department</p>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.department && <p className="!text-red-500 text-xs mt-1">{errors.department.message}</p>}
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Division</p>
              <Controller
                name="division"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.division && <p className="!text-red-500 text-xs mt-1">{errors.division.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Cluster</p>
              <Controller
                name="cluster"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.cluster && <p className="!text-red-500 text-xs mt-1">{errors.cluster.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Cluster Description</p>
              <Controller
                name="clusterDescription"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.clusterDescription && <p className="!text-red-500 text-xs mt-1">{errors.clusterDescription.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Operation Hours</p>
              <Controller
                name="operationHours"
                control={control}
                render={({ field }) => (
                  <PrimaryInput {...field} />
                )}
              />
              {errors.operationHours && <p className="!text-red-500 text-xs mt-1">{errors.operationHours.message}</p>}
            </div>
            <div className="flex-1">
              <p className="font-semibold !text-sm !mb-1">Hours Per Day</p>
              <Controller
                name="hoursPerDay"
                control={control}
                render={({ field }) => (
                  <PrimaryInput type="number" {...field} />
                )}
              />
              {errors.hoursPerDay && <p className="!text-red-500 text-xs mt-1">{errors.hoursPerDay.message}</p>}
            </div>
          </div>
        </div>
        <div className='flex justify-end mt-5'>
          <Button type="primary" htmlType="submit">Create New Room</Button>
        </div>
      </form>
    </LoadingWrapper>
  );
}

export default RoomForm;
