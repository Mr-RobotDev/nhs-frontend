"use client";
import React from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import {
  getDashboardCards,
  getDashboards,
  setCurrentDashboard,
  setTimeFrame,
  updateCard,
  setDashboardFromDashboards
} from "@/app/store/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { DashboardCardType, TimeFrameType } from "@/type";
import DashboardMenu from "@/components/Dashboard/dashboardViews/DashboardMenu";
import CustomCard from "../../ui/Card/CustomCard";
import EmptyDashboard from "./EmptyDashboard";
import { useRouter } from "next/navigation";
import AddCardModal from "../Modals/AddCardModal";
import TimeFrameMenu from "./TimeFrameMenu";
import { DatePicker, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import timeFrames from "@/utils/time_frames";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface singleDashboardViewProps {
  id: string;
}
const SingleDashboardView = ({ id }: singleDashboardViewProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    error,
    dashboards,
    currentDashboard: currentSelectedDashboard,
    dashboardCards,
    timeFrame,
    isLoading
  } = useSelector((state: RootState) => state.dashboardReducer);
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, "day").startOf("day"),
    dayjs().endOf("day"),
  ])

  useEffect(() => {
    dispatch(getDashboards());
    dispatch(getDashboardCards({ dashboardId: id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(setDashboardFromDashboards(id))
  }, [dashboards, id, dispatch])

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 500);
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id) {

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      const to = params.get("to");
      const key = params.get("key");

      if (from && to && key) {
        const timeFrame = { ...timeFrames[key] };

        timeFrame.startDate = from;
        timeFrame.endDate = to;

        console.log('key->', key)
        if (key !== 'CUSTOM') {
          console.log('first called')
          dispatch(setTimeFrame(timeFrame));
        }

      }
    }
  }, [id, dispatch]);

  const handleLayoutChange = (layout: any, layouts: any) => {
    if (layouts.sm || layouts.xs) return;

    const updatedCards = layout.map((item: any) => {
      const card = dashboardCards.find((card) => card.id === item.i);
      if (card) {
        if (
          card.x !== item.x ||
          card.y !== item.y ||
          card.rows !== item.w ||
          card.cols !== item.h
        ) {
          return {
            ...card,
            x: item.x,
            y: item.y,
            rows: item.w,
            cols: item.h,
          };
        }
      }
      return null;
    });

    updatedCards.forEach((card: DashboardCardType) => {
      if (!card) return;
      dispatch(
        updateCard({
          dashboardId: currentSelectedDashboard.id,
          cardObj: card,
        })
      );
    });
  };

  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates && dates.length > 0) {
      let newRange: [Dayjs, Dayjs];
      newRange = [dayjs(dates[0]), dayjs(dates[1])];
      setRange(newRange);
      const from = newRange[0].format("YYYY-MM-DD");
      const to = newRange[1].format("YYYY-MM-DD");
      if (window && window.history) {
        const url = new URL(window.location.href);
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        window.history.replaceState({}, "", url.toString());
      }

      const timeFrame = { ...timeFrames['CUSTOM'] };

      timeFrame.startDate = from;
      timeFrame.endDate = to;

      console.log('Called')
      dispatch(setTimeFrame(timeFrame));
    } else {
      toast.error("Date Range cannot be empty");
    }
  };

  return currentSelectedDashboard ? (
    <>
      <div className=" overflow-hidden py-3">
        <div className=" flex justify-end">
          <div className="block md:hidden mb-1">
            <span
              onClick={() => setIsModalOpen(true)}
              className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faCirclePlus} />
              Create New Card
            </span>
          </div>
        </div>
        <div className=" flex flex-wrap gap-3 flex-row sm:gap-0 justify-between items-start w-full">
          <div className=" flex-1 sm:flex-none">
            <p className=" text-sm mb-1">Current Dashboard</p>
            <DashboardMenu
              dashboardsList={dashboards}
              routingFunctionality={true}
            />
          </div>
          {isAdmin && currentSelectedDashboard && dashboardCards.length !== 0 && (
            <div className=" flex-1 flex flex-row items-end flex-wrap justify-start sm:justify-end gap-3 w-full lg:w-auto">
              <div className=" flex flex-row- items-end gap-0 md:gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-auto">
                  <p className=" text-sm mb-1">Time frame</p>
                  <TimeFrameMenu functionality={true} />
                </div>
                <div>
                  {
                    timeFrame.key === 'CUSTOM' &&
                    <div className="hidden md:block">
                      <RangePicker
                        className="flex h-[42px] w-72"
                        onChange={handleRangeChange}
                        defaultValue={range}
                      />
                    </div>
                  }
                </div>
              </div>
              <div className="hidden md:block">
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center"
                >
                  <FontAwesomeIcon icon={faCirclePlus} />
                  Create New Card
                </span>
              </div>
            </div>
          )}
        </div>
        <div className=" block md:hidden mt-2">
          {
            timeFrame.key === 'CUSTOM' &&
            <div className="">
              <RangePicker
                className="flex h-[42px]"
                onChange={handleRangeChange}
                defaultValue={range}
              />
            </div>
          }
        </div>

        {(dashboardCards.length === 0 && !isLoading.gettingDashboardCards) &&
          <EmptyDashboard />
        }

        {isLoading.gettingDashboardCards &&
          <div className=" w-full h-full flex justify-center items-center mt-28">
            <Spin size="large" />
          </div>
        }

        {dashboardCards.length !== 0 &&
          <div className="mt-3">
            <ResponsiveGridLayout
              draggableCancel=".cancelSelectorName"
              className="layout"
              margin={[20, 20]}
              rowHeight={160}
              breakpoints={{
                "2xl": 1536,
                xl: 1280,
                lg: 1024,
                md: 768,
                sm: 640,
                xs: 480,
              }}
              cols={{ "2xl": 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 2 }}
              resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
              onLayoutChange={handleLayoutChange}
              isResizable={!isSmallScreen}
              isDraggable={!isSmallScreen}
            >
              {dashboardCards.map((card: DashboardCardType) => (
                <div
                  key={card.id}
                  data-grid={{
                    x: card.x,
                    y: card.y,
                    w: card.rows,
                    h: card.cols,
                    minW: 2,
                    minH: 2,
                  }}
                >
                  <CustomCard cardObj={card} />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        }
      </div>
      <AddCardModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dashboardId={currentSelectedDashboard.id}
      />
    </>
  ) : (
    <div className=" w-full h-full flex justify-center items-center">
      <Spin />
    </div>
  );
};

export default withDashboardLayout(SingleDashboardView);
