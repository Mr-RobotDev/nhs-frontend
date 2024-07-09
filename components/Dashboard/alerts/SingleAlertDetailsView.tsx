'use client'
import { AlertDataType, DevicesType } from '@/type'
import React, { useState } from 'react'
import withDashboardLayout from '@/hoc/withDashboardLayout'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, Card, Checkbox, Modal, Spin, Switch } from 'antd'
import { PrimaryInput } from '@/components/ui/Input/Input'
import CustomTags from '../reports/CustomTags'
import ScheduleTypeMenu from '../reports/ScheduleTypeMenu'
import { daysOfWeek, triggerRangeTypeOptions, triggerWhenOptions } from '@/utils/form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store/store'
import CustomMenu from '@/components/ui/Menu/CustomMenu'
import DeviceSelector from '../Modals/DeviceSelector'
import DeviceDetailsComp from '../DeviceDetailsComp'
import DeviceDetail from './DeviceDetail'
import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { validateAlertFormData } from '@/utils/helper_functions'
import { resetAlertDevice } from '@/app/store/slice/devicesSlice'

interface SingleAlertDetailsViewProps {
  alert: AlertDataType
  device: DevicesType
  creatingNewAlert: boolean
}

const typeAndUnits: { [key: string]: string } = {
  pressure: 'atm',
  temperature: '°C',
  relativeHumidity: '%RH'
};

const SingleAlertDetailsView = ({ alert, device, creatingNewAlert }: SingleAlertDetailsViewProps) => {
  const [formData, setFormData] = useState({
    ...alert,
    device: device.id
  })
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([device.id]);
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deviceChanged, setDeviceChanged] = useState(false)

  const { isAdmin } = useSelector((state: RootState) => state.authReducer)
  const { deviceForAlert } = useSelector((state: RootState) => state.devicesReducer)
  const isCustomScheduleType = formData?.scheduleType === "custom";
  const isWeekdaysScheduleType = formData?.scheduleType === "weekdays";
  const isEverydayScheduleType = formData?.scheduleType === "everyday";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox && (e.target as HTMLInputElement).checked;

    setFormData(prevState => {
      if (prevState) {
        if (name === 'duration'){
          return {
            ...prevState,
            trigger: {
              ...prevState.trigger,
              duration: Number(value)
            }
          };
        } else {
          return {
            ...prevState,
            [name]: isCheckbox ? checked : value,
          };
        }
      }
      return prevState;
    });
  };

  const updateDeviceinAlertObj = () => {
    if (formData.device === selectedRowKeys[0]) {
      setIsVisible(false)
      return;
    }
    setDeviceChanged(true)
    setIsVisible(false)
    formData.device = selectedRowKeys[0];
  }

  const handleDaysCheckbox = (e: any, day: string) => {
    const checked = e.target.checked;
    setFormData((prevState) => {
      if (prevState) {
        const newWeekdays = checked
          ? [...prevState.weekdays, day]
          : prevState.weekdays.filter((d) => d !== day);
        return { ...prevState, weekdays: newWeekdays };
      }
      return prevState;
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevState) => prevState && { ...prevState, enabled: checked });
  };

  const handleScheduleTypeChange = (value: string) => {
    setFormData((prevState) => prevState && { ...prevState, scheduleType: value })
  }

  const handleTriggerWhenChange = (value: string[]) => {
    setFormData(prevState => ({
      ...prevState,
      trigger: {
        ...prevState.trigger,
        state: value[0]
      }
    }));
  }

  const handleUpdateAlert = async () => {
    const { isValid, message } = validateAlertFormData(formData);

    if (!isValid) {
      toast.error(message);
      return;
    }

    if (formData) {
      setLoading(true);
      const dataToSend = { ...formData };
      delete dataToSend.id;

      try {
        const response = await axiosInstance.patch(
          `/alerts/${alert.id}`,
          dataToSend
        );
        if (response.status === 200) {
          console.log(response);
          router.push('/dashboard/alerts')
          toast.success("Alert Updated Successfully");
        } else {
          console.log("error ->", response);
        }
      } catch (error: any) {
        console.log("error->", error);
        toast.error(error.response.data.message[0]);
      } finally {
        setLoading(false);
        dispatch(resetAlertDevice())
      }
    }
  }

  const handleCreateNewAlert = async () => {

    const { isValid, message } = validateAlertFormData(formData);

    if (!isValid) {
      toast.error(message);
      return;
    }

    if (formData) {
      setLoading(true);
      const dataToSend = { ...formData };
      delete dataToSend.enabled;
      delete dataToSend.id

      const { isValid, message } = validateAlertFormData(formData);

      if (!isValid) {
        toast.error(message);
        return;
      }

      try {
        const response = await axiosInstance.post(
          `/alerts/${alert.id}`,
          dataToSend
        );
        if (response.status === 200) {
          console.log(response);
          router.push('/dashboard/alerts')
          toast.success("Alert Created Successfully");
        } else {
          console.log("error ->", response);
        }
      } catch (error: any) {
        console.log("error->", error);
        toast.error(error.response.data.message[0]);
      } finally {
        setLoading(false);
        dispatch(resetAlertDevice())
      }
    }
  }

  const renderCheckboxes = () => daysOfWeek.map((day) => (
    <Checkbox
      key={day}
      name="weekdays"
      checked={
        (day !== "saturday" &&
          day !== "sunday" &&
          (isWeekdaysScheduleType || isEverydayScheduleType)) ||
        ((day === "saturday" || day === "sunday") &&
          isEverydayScheduleType) ||
        formData?.weekdays.includes(day)
      }
      disabled={!isCustomScheduleType}
      onChange={(e) => handleDaysCheckbox(e, day)}
    >
      {day.charAt(0).toUpperCase() + day.slice(1)}
    </Checkbox>
  ));

  return (
    <div className='container md:px-24'>
      <Link
        className="text-blue-500 cursor-pointer flex flex-row gap-2 items-center !mb-2"
        href={'/dashboard/alerts'}
      >
        <ArrowLeftIcon className="w-3 transition-colors duration-200 hover:text-blue-700" />
        <p className="!mb-0 text-blue-500 cursor-pointer transition-colors duration-200 hover:text-blue-700">
          Back to full list
        </p>
      </Link>

      <Spin spinning={loading}>
        <div>
          <Card>
            <div className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-lg !mb-1">Name</p>
                <PrimaryInput
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  disabled={!isAdmin}
                />
              </div>
              {!creatingNewAlert && <div className="px-8 h-full">
                <p className="font-semibold text-lg !mb-1">Enabled</p>
                <Switch
                  checked={formData?.enabled}
                  onChange={handleSwitchChange}
                  disabled={!isAdmin}
                />
              </div>}
            </div>
          </Card>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-[2px] h-[40px] bg-slate-300"></div>
        </div>
        <Card>
          <p className="font-semibold text-lg">Recipient Emails</p>
          {formData?.recipients && (
            <CustomTags
              initialData={formData?.recipients}
              type="email"
              setFormData={setFormData}
              isAdmin={isAdmin}
            />
          )}
        </Card>
        <div className="flex items-center justify-center">
          <div className="w-[2px] h-[40px] bg-slate-300"></div>
        </div>
        <Card>
          <div className="flex flex-row justify-between">
            <p className="font-semibold text-lg">Schedule</p>
          </div>
          <div className="flex items-center">
            <p className="!mb-1 text-sm">Type</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-12">
            <div className="flex flex-row items-center border rounded-md shadow-md w-[200px] mb-3 md:mb-0">
              <ScheduleTypeMenu isAdmin={isAdmin} initialScheduleType={formData?.scheduleType} handleScheduleTypeChange={handleScheduleTypeChange} />
            </div>
            <div className="grid grid-cols-3 md:flex md:flex-row md:flex-wrap md:justify-between w-full">
              {renderCheckboxes()}
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-center">
          <div className="w-[2px] h-[40px] bg-slate-300"></div>
        </div>
        <Card>
          <p className="font-semibold text-lg">What should trigger an alert?</p>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            <div>
              <p className="!mb-1 text-sm">When</p>
              <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0">
                <CustomMenu 
                  handleTypeChange={handleTriggerWhenChange} 
                  isAdmin={isAdmin} 
                  initialValue={[formData.trigger.state as string]} 
                  options={triggerWhenOptions} />
              </div>
            </div>
            <div>
              <p className="!mb-1 text-sm">Duration (minutes)</p>
              <div className="flex flex-row items-center  mb-3 md:mb-0">
                <PrimaryInput
                  name="duration"
                  value={formData.trigger.duration?.toString()}
                  onChange={handleChange}
                  className='!h-[49px]'
                  type='number'
                />
              </div>
            </div>
          </div>
        </Card>
        <div className="flex items-center justify-center">
          <div className="w-[2px] h-[40px] bg-slate-300"></div>
        </div>
        <Card>
          <div className=' flex flex-row justify-between items-center'>
            <p className="font-semibold text-lg !mb-0">Device</p>
            <div>
              {isAdmin && <Button onClick={() => setIsVisible(true)}>Select the Device</Button>}
            </div>
          </div>

          {<div>
            {(deviceForAlert.id !== '' || device.id !== '') && <DeviceDetail device={deviceChanged || creatingNewAlert ? deviceForAlert : device} />}
          </div>}
        </Card>
        <div className=" flex flex-row justify-end mt-4">
          {!creatingNewAlert && isAdmin && (
            <Button type="primary" onClick={handleUpdateAlert} className=" w-32">
              Update
            </Button>
          )}
          {creatingNewAlert && (
            <Button type="primary" onClick={handleCreateNewAlert} className=" w-32">
              Create
            </Button>
          )}
        </div>
      </Spin>
      <Modal
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        width={700}
        footer={[]}
      >
        <p className="font-semibold text-lg !mb-0 text-center">Select the Device</p>
        <div className='!h-[600px] overflow-y-auto py-3'>
          <DeviceSelector
            allowSingleDevice={true}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            deviceType={'motion'}
          />
        </div>
        {selectedRowKeys.length === 1 &&
          <div className=' flex justify-end mt-3'>
            <Button type='primary' className=' w-20' onClick={updateDeviceinAlertObj}>Done</Button>
          </div>
        }
      </Modal>
    </div>
  )
}

export default SingleAlertDetailsView
