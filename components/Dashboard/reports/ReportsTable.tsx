import React, { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { DashboardType, ReportsType } from "@/type";
import axiosInstance from "@/lib/axiosInstance";
import { Button, Card, Checkbox, Spin, Switch, Table, TableProps } from "antd";
import {
  ArrowLeftIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { PrimaryInput } from "@/components/ui/Input/Input";
import { scheduletypeOptions, timeFrameOptions } from "@/utils/form";
import CustomTags from "./CustomTags";
import toast from "react-hot-toast";
import TimeFrameMenu from "../dashboardViews/TimeFrameMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import NoReport from "./NoReport";
import { validateReportsFormData } from "@/utils/helper_functions";
import { CheckIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ScheduleTypeMenu from "./ScheduleTypeMenu";

interface ReportsTableProps {
  currentDashboard: DashboardType;
  createNewReport: boolean;
  setCreateNewReport: Dispatch<SetStateAction<boolean>>;
}

const emptyReportState: ReportsType = {
  name: "",
  timeframe: "",
  recipients: [],
  scheduleType: "",
  enabled: false,
  weekdays: [],
  times: [],
  id: "",
};

const ReportsTable = ({
  currentDashboard,
  setCreateNewReport,
  createNewReport,
}: ReportsTableProps) => {
  const [reports, setReports] = useState<ReportsType[]>([]);
  const [showDetailsReport, setShowDetailsReport] = useState<ReportsType | null>();
  const [formData, setFormData] = useState<ReportsType | null>(null);
  const { user, isAdmin } = useSelector((state: RootState) => state.authReducer)
  const [loading, setLoading] = useState(false);
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const { timeFrame } = useSelector(
    (state: RootState) => state.dashboardReducer
  );

  useEffect(() => {
    if (showDetailsReport) {
      setFormData(showDetailsReport);
      setCreateNewReport(false);
    }
  }, [showDetailsReport, setCreateNewReport]);

  useEffect(() => {
    if (currentDashboard.id !== "") {
      (async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/dashboards/${currentDashboard.id}/reports`
          );
          if (response.status === 200) {
            setReports(response.data.results);
          } else {
            console.log("error ->", response);
          }
        } catch (error: any) {
          console.log("Error:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [currentDashboard]);

  useEffect(() => {
    if (createNewReport) {
      emptyReportState.recipients = [user?.email]
      emptyReportState.scheduleType = 'weekdays'
      setFormData(emptyReportState);
    }
  }, [createNewReport, setCreateNewReport, user?.email]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox && (e.target as HTMLInputElement).checked;

    setFormData(
      (prevState) =>
        prevState && {
          ...prevState,
          [name]: isCheckbox ? checked : value,
        }
    );
  };

  const handleDeleteReport = async (e: any, reportId: string) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `/dashboards/${currentDashboard.id}/reports/${reportId}`
      );
      if (response.status === 200) {
        const updatedReports = reports.filter(
          (report) => report.id !== reportId
        );
        setReports(updatedReports);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prevState) => prevState && { ...prevState, enabled: checked });
  };

  const columns: TableProps<any>["columns"] = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SCHEDULE TYPE",
      key: "scheduleType",
      dataIndex: "scheduleType",
      render: (_, { scheduleType }) => (
        <div className="flex flex-row gap-4 items-center">
          <p className=" !text-black !mb-0">
            {
              scheduletypeOptions.find(
                (option) => option.value === scheduleType
              )?.label
            }
          </p>
        </div>
      ),
    },
    {
      title: "RECIPIENTS",
      key: "recipients",
      dataIndex: "recipients",
      render: (_, { recipients }) => (
        <div className="flex flex-row gap-2 items-center">
          {recipients.length}
          <UserIcon width={20} />
        </div>
      ),
    },
    {
      title: "TIMEFRAME",
      key: "timeframe",
      dataIndex: "timeframe",
      render: (_, { timeframe }) => (
        <div className="flex flex-row gap-4 items-center">
          <p className=" !text-black !mb-0">
            {
              timeFrameOptions.find((option) => option.value === timeframe)
                ?.label
            }
          </p>
        </div>
      ),
    },
    {
      title: "ENABLED",
      key: "enabled",
      dataIndex: "enabled",
      render: (_, { enabled }) => (
        <div className="flex flex-row gap-4 items-center">
          {enabled ? <CheckIcon className=" text-green-700" width={20} /> : <XMarkIcon className=" text-red-700" width={20} />}
        </div>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      title: "ACTIONS",
      key: "actions",
      dataIndex: "aactions",
      render: (_, { id }) => {
        return (
          <div className=" flex flex-row gap-4 items-center">
            <p
              onClick={(e) => handleDeleteReport(e, id)}
              className="  !text-red-400 hover:!text-red-600 duration-200 transition-all transform cursor-pointer flex flex-row gap-2 items-center"
            >
              <TrashIcon width={20} />
            </p>
          </div>
        );
      },
    },)
  }

  const showReportsDetails = (record: ReportsType) => ({
    onClick: () => setShowDetailsReport(record),
  });

  const handleScheduleTypeChange = (value: string) => {
    setFormData((prevState) => prevState && { ...prevState, scheduleType: value })
  }

  const handleGoBack = () => {
    setCreateNewReport(false);
    setShowDetailsReport(null);
  };

  const handleUpdateReport = async () => {
    const { isValid, message } = validateReportsFormData(formData);

    if (!isValid) {
      toast.error(message);
      return;
    }

    if (formData) {
      setLoading(true);
      const dataToSend = { ...formData };
      delete dataToSend.id
      delete dataToSend.dashboard;

      dataToSend.timeframe = timeFrame.key;

      try {
        const response = await axiosInstance.patch(
          `/dashboards/${currentDashboard.id}/reports/${formData.id}`,
          dataToSend
        );
        if (response.status === 200) {
          console.log(response);
          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === formData.id ? response.data : report
            )
          );
          setShowDetailsReport(null);
          toast.success("Report Updated Successfully");
        } else {
          console.log("error ->", response);
        }
      } catch (error: any) {
        console.log("error->", error);
        toast.error(error.response.data.message[0]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateReport = async () => {
    const { isValid, message } = validateReportsFormData(formData);

    if (!isValid) {
      toast.error(message);
      return;
    }

    if (formData) {
      setLoading(true);
      delete formData.enabled
      delete formData.id

      formData.timeframe = timeFrame.key;
      try {
        const response = await axiosInstance.post(
          `/dashboards/${currentDashboard.id}/reports`,
          formData
        );
        if (response.status === 201) {
          setReports((prevReports) => [...prevReports, response.data]);
          setShowDetailsReport(null);
          setCreateNewReport(false);
          toast.success("Report added successfully");
        } else {
          console.log("error ->", response);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message[0]);
      } finally {
        setLoading(false);
      }
    }
  };

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

  const renderCheckboxes = () =>
    daysOfWeek.map((day) => (
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

  const isCustomScheduleType = formData?.scheduleType === "custom";
  const isWeekdaysScheduleType = formData?.scheduleType === "weekdays";
  const isEverydayScheduleType = formData?.scheduleType === "everyday";

  if (loading && reports.length === 0) {
    return <div className=" flex justify-center items-center mt-24">
      <Spin />
    </div>
  }

  return (
    <div className="mt-6">
      <div>
        <div
          className={`${showDetailsReport || createNewReport ? "hidden" : "block"
            }`}
        >

          {(reports.length === 0 && !loading) &&
            <NoReport />
          }

          {loading &&
            <div className=" w-full h-full flex justify-center items-center mt-28">
              <Spin size="large" />
            </div>
          }

          {reports.length !== 0 && !loading &&
            <div className=" shadow-md p-2 bg-white">
              <Table
                columns={columns}
                className="cursor-pointer h-full"
                dataSource={reports}
                scroll={{ x: 500 }}
                rowClassName="overflow-hidden"
                loading={loading}
                onRow={showReportsDetails}
              />
            </div>
          }

        </div>
        <div
          className={`${showDetailsReport || createNewReport ? "block" : "hidden"
            }`}
        >
          <div className="container md:px-24">
            <div
              className="text-blue-500 cursor-pointer flex flex-row gap-2 items-center !mb-2"
              onClick={handleGoBack}
            >
              <ArrowLeftIcon className="w-3 transition-colors duration-200 hover:text-blue-700" />
              <p className="!mb-0 text-blue-500 cursor-pointer transition-colors duration-200 hover:text-blue-700">
                Back to full list
              </p>
            </div>

            <Spin spinning={loading}>
              <div>
                <Card>
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-lg !mb-1">Name</p>
                      <PrimaryInput
                        name="name"
                        value={formData?.name}
                        onChange={onChange}
                        disabled={!isAdmin}
                      />
                    </div>
                    {!createNewReport && (
                      <div className="px-8  h-full ">
                        <p className="font-semibold text-lg !mb-1">Enabled</p>
                        <Switch
                          disabled={!isAdmin}
                          checked={formData?.enabled}
                          onChange={handleSwitchChange}
                        />
                      </div>
                    )}
                  </div>
                </Card>
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
                  <div className=" flex flex-col items-start mb-6">
                    <p className="!mb-1 text-sm">Time Frame </p>
                    <div className="flex flex-row items-center border rounded-md shadow-md w-[170px]">
                      <TimeFrameMenu
                        functionality={false}
                        initialValue={formData?.timeframe}
                        isAdmin={isAdmin}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="!mb-1 text-sm">Type </p>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-12">
                    <div className="flex flex-row items-center border rounded-md shadow-md w-[170px] mb-3 md:mb-0">
                      <ScheduleTypeMenu isAdmin={isAdmin} initialScheduleType={formData?.scheduleType} handleScheduleTypeChange={handleScheduleTypeChange} />
                    </div>
                    <div className=" grid grid-cols-3 md:flex md:flex-row md:flex-wrap md:justify-between w-full">
                      {renderCheckboxes()}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-lg my-6">Time</p>
                    {formData?.times && (
                      <CustomTags
                        initialData={formData?.times}
                        type="time"
                        setFormData={setFormData}
                        isAdmin={isAdmin}
                      />
                    )}
                  </div>
                </Card>
                <div className=" flex flex-row justify-end mt-4">
                  {!createNewReport && isAdmin && (
                    <Button type="primary" onClick={handleUpdateReport} className=" w-32">
                      Update
                    </Button>
                  )}
                  {createNewReport && (
                    <Button onClick={handleCreateReport} className=" w-32">
                      Create
                    </Button>
                  )}
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;
