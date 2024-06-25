import TemperatureChart from "@/components/Dashboard/dashboardViews/TemperatureChart";
import axiosInstance from "@/lib/axiosInstance";
import { DashboardCardType, DevicesType } from "@/type";
import { memo, useEffect, useState } from "react";
import { Button, Card, Spin, Tooltip } from "antd";
import { EventsMap, Event, DeviceData } from "@/type";
import OptionsMenu from "@/components/Dashboard/dashboardViews/OptionMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import Image from "next/image";
import { PrimaryInput } from "../Input/Input";
import { updateCard } from "@/app/store/slice/dashboardSlice";
import SingleDeviceDashCard from "@/components/Dashboard/dashboardViews/SingleDeviceDashCard";
import { getDeviceLabelFromState } from "@/utils/helper_functions";
import Link from "next/link";

interface CardProps {
  cardObj: DashboardCardType;
}
const countStates = (devices: any) => {
  return devices.reduce(
    (acc: any, device: any) => {
      if (device.state === 'MOTION_DETECTED') {
        acc.motionDetected.count++;
        acc.motionDetected.devices.push(device);
      } else if (device.state === 'NO_MOTION_DETECTED') {
        acc.noMotionDetected.count++;
        acc.noMotionDetected.devices.push(device);
      }
      return acc;
    },
    {
      motionDetected: { count: 0, devices: [] },
      noMotionDetected: { count: 0, devices: [] },
    }
  );
};

const CustomCard: React.FC<CardProps> = ({ cardObj }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editingName, setEditingName] = useState(cardObj.name);
  const [card, setCard] = useState<DashboardCardType>(cardObj);
  const { timeFrame, currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);
  const dispatch: AppDispatch = useDispatch();
  const { motionDetected, noMotionDetected } = countStates(cardObj.devices);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  useEffect(() => {
    setCard(cardObj);
  }, [cardObj]);


  useEffect(() => {
    // let isCancelled = false;

    const fetchEventsForDevices = async () => {

      const fetchPromises = card.devices.map(async (device) => {
        if (timeFrame.startDate && timeFrame.endDate) {
          setLoading(true);
          const { id, name } = device;
          try {
            const response = await axiosInstance.get(`/devices/${device.id}/events`, {
              params: {
                from: timeFrame.startDate,
                to: timeFrame.endDate,
              },
            });

          } catch (error) {
            console.error(`Error fetching events for device ${id}:`, error);
          } finally {
            setLoading(false)
          }
        }
      });

      await Promise.all(fetchPromises);
    };

    // fetchEventsForDevices();

  }, [card, timeFrame.startDate, timeFrame.endDate]);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleOnCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRenaming(false);
    console.log("clicked");
    setEditingName(card.name);
  };

  const handleUpdateCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setCard((prevCard) => {
      return {
        ...prevCard,
        name: editingName,
      };
    });

    dispatch(
      updateCard({
        dashboardId: currentDashboard.id,
        cardObj: {
          ...card,
          name: editingName,
        },
      })
    ).then(() => {
      setIsRenaming(false);
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-full bg-white rounded-lg shadow-lg p-3">
          <Spin />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-3">
          <div className=" flex flex-row justify-between items-center border-b pb-2">
            <div className=" flex flex-row items-center gap-2">
              <div className=" w-11 h-11 border border-blue-100 rounded-md p-1">
                <Image
                  src={'/icons/motion-sensor.png'}
                  alt="Sensors"
                  className="w-full h-full object-cover rounded-sm"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
              <div className=" flex flex-col">
                {!isRenaming ? (
                  <div className="!text-lg font-semibold">{card.name}</div>
                ) : (
                  <div className="flex border rounded-md">
                    <PrimaryInput
                      placeholder="Dashboard name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className=" !border-t-0 !border-l-0 !border-b-0 !border-r !rounded-none !border-gray-300 "
                    />
                    <Tooltip
                      getTooltipContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      title={`${editingName.length < 3 ? "Atleast 3 characters" : ""
                        }`}
                    >
                      <span className="flex">
                        <button
                          disabled={editingName.length < 3}
                          onMouseDown={handleUpdateCard}
                          className="mini-button hover:bg-blue-50 bg-transparent border-l-none px-3 disabled:cursor-not-allowed disabled:opacity-80 hover:bg-hover-primary transition-all ease-in-out duration-300 w-full"
                        >
                          Save
                        </button>
                      </span>
                    </Tooltip>
                    <span className="flex">
                      <button
                        disabled={false}
                        className="mini-button border-l px-2 bg-transparent border-l-none rounded-e-lg hover:bg-blue-50 !w-full transition-all ease-in-out duration-300"
                        onMouseDown={handleOnCancelClick}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                )}
                <span className=" text-xs text-slate-400">
                  {card.devices.length} Sensors
                </span>
              </div>
            </div>
            {isAdmin && !isRenaming && (
              <Button onMouseDown={handleOnClick} className=" w-10 h-10 border flex items-center justify-center">
                <OptionsMenu cardId={card.id} setIsRenaming={setIsRenaming} />
              </Button>
            )}
          </div>
          <div className="flex-grow">
            {
              card.devices.length > 1 ?
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className=" grid grid-cols-2 h-full">
                  <div className=" w-full h-full flex justify-center items-center">
                    <div className=" flex flex-col items-center">
                      <p className=" mb-0 text-4xl font-semibold">{motionDetected.count}</p>
                      <p className=" mt-1">Occupied</p>
                    </div>
                  </div>
                  <div className=" w-full h-full flex justify-center items-center border-l border-l-gray-300">
                    <div className=" flex flex-col items-center">
                      <p className=" mb-0 text-4xl font-semibold">{noMotionDetected.count}</p>
                      <p className=" mt-1">Not Occupied</p>
                    </div>
                  </div>
                </div>

                : (
                  <div className=" w-full h-full flex justify-center items-center">
                    <p className=" text-3xl font-semibold">{getDeviceLabelFromState(card.devices[0].state)}</p>
                  </div>
                )
            }
          </div>
        </div>
      )}
      <div
        onMouseEnter={() => setIsHovered2(true)}
        onMouseLeave={() => setIsHovered2(false)}
        className=" pt-6 relative -top-4 z-[999px]"
      >
        {((isHovered || isHovered2) && card.devices.length !== 1) && (
          <Card

            className=" duration-300 transform transition-all relative z-[999px]">
            <div className=" bg-white flex flex-col gap-2 justify-start items-center ">
              <div className=" flex flex-col gap-0 w-full">
                {
                  motionDetected.devices.map((device: any) => (
                    <>
                      <div key={device.name} className=" flex flex-row gap-2 w-full">
                        <p className="!mb-0"><strong className=" mr-3">Not Occupied</strong> {device.name}</p>
                      </div>
                      <hr className=" h-2 w-full my-1" />
                    </>
                  ))
                }
              </div>

              <div className=" flex flex-col gap-0 w-full">
                {
                  noMotionDetected.devices.map((device: any) => (
                    <Link key={device.id} href={`/dashboard/devices/${device.id}`} >
                      <div className=" flex flex-row gap-2 w-full">
                        <p className="!mb-0"><strong className=" mr-3">Not Occupied</strong> {device.name}</p>
                      </div>
                      <hr className=" h-2 w-full my-1" />
                    </Link>
                  ))
                }
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default memo(CustomCard);
