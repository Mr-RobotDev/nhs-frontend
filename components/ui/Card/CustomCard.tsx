import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { Button, Spin, Tooltip } from "antd";
import { DashboardCardType, DeviceEventsType } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import Image from "next/image";
import { PrimaryInput } from "../Input/Input";
import { updateCard } from "@/app/store/slice/dashboardSlice";
import axiosInstance from "@/lib/axiosInstance";
import OptionsMenu from "@/components/Dashboard/dashboardViews/OptionMenu";
import MotionNoMotionGraph from "./MotionNoMotionGraph";
import HistogramChart from "@/components/Dashboard/Device/Chart/HistogramChart";
import HeatmapChart from "@/components/Dashboard/Device/Chart/HeatMapChart";

interface CardProps {
  cardObj: DashboardCardType;
}

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);
  const [graphType, setGraphType] = useState('motion-nomotion');
  const [deviceEvents, setDeviceEvents] = useState<DeviceEventsType[]>([]);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const [headingData, setHeadingData] = useState('');

  useEffect(() => {
    setCard(cardObj);
  }, [cardObj]);

  useEffect(() => {
    const fetchEventsForDevices = async () => {
      const fetchPromises = card.devices.map(async (device) => {
        if (timeFrame.startDate && timeFrame.endDate) {
          setLoading(true);
          try {
            const response = await axiosInstance.get(`/devices/${device.id}/events`, {
              params: {
                from: timeFrame.startDate,
                to: timeFrame.endDate,
              },
            });

            if (response.status === 200) {
              setDeviceEvents(response.data);
            }
          } catch (error) {
            console.error(`Error fetching events for device ${device.id}:`, error);
          } finally {
            setLoading(false);
          }
        }
      });
      await Promise.all(fetchPromises);
    };
    fetchEventsForDevices();
  }, [card, timeFrame.startDate, timeFrame.endDate]);

  useEffect(() => {
    if (cardRef.current) {
      setPopoverWidth(cardRef.current.offsetWidth);
    }
  }, [cardRef.current?.offsetWidth]);

  const handleUpdateCard = (e: any) => {
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

  
  useEffect(() => {
    console.log('cardRef.current?.offsetHeight->', cardRef.current?.offsetHeight)
    setHeight(cardRef.current?.offsetHeight)
  }, [cardRef.current?.offsetHeight])

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full h-full bg-white rounded-lg shadow-lg p-3">
          <Spin />
        </div>
      ) : (
        <div
          ref={cardRef}
          className={`flex flex-col w-full h-full bg-white rounded-lg shadow-lg p-3 relative z-10 h-[${height}px]`}
        >
          <div className="flex flex-row justify-between items-center border-b pb-2">
            <div className="flex flex-row items-center gap-2">
              <div className="w-11 h-11 border border-blue-100 rounded-md p-1">
                <Image
                  src={"/icons/motion-sensor.png"}
                  alt="Sensors"
                  className="w-full h-full object-cover rounded-sm"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col">
                {!isRenaming ? (
                  <div className="!text-lg font-semibold">{card.name}</div>
                ) : (
                  <div className="flex border rounded-md">
                    <PrimaryInput
                      placeholder="Dashboard name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="!border-t-0 !border-l-0 !border-b-0 !border-r !rounded-none !border-gray-300"
                    />
                    <Tooltip
                      getTooltipContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      title={`${editingName.length < 3 ? "At least 3 characters" : ""
                        }`}
                    >
                      <span className="flex">
                        <button
                          disabled={editingName.length < 3}
                          onMouseDown={handleUpdateCard}
                          onTouchStart={handleUpdateCard}
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
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsRenaming(false);
                          setEditingName(card.name);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsRenaming(false);
                          setEditingName(card.name);
                        }}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                )}
                <span className={`text-xs text-slate-400 ${headingData ? 'font-semibold' : 'font-medium '}`}>
                  {headingData ? headingData : `${card.devices.length} Sensors` }
                </span>
              </div>
            </div>
            {isAdmin && !isRenaming && (
              <Button
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-10 h-10 border flex items-center justify-center cancelSelectorName"
              >
                <OptionsMenu 
                  cardId={card.id} 
                  setIsRenaming={setIsRenaming} 
                  setGraphType={setGraphType} 
                  graphType={graphType}
                  noOfSensors={card.devices.length}
                />
              </Button>
            )}
          </div>
          {graphType === 'motion-nomotion' && <MotionNoMotionGraph setHeadingData={setHeadingData} data={deviceEvents} cardObj={cardObj} popoverWidth={popoverWidth} />}
          {graphType === 'histogram' && <HistogramChart data={deviceEvents} />}
          {graphType === 'heatmap' && <HeatmapChart data={deviceEvents} />}
        </div>
      )}
    </>
  );
};

export default CustomCard;
