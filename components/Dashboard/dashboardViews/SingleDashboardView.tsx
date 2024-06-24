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
import { Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import timeFrames from "@/utils/time_frames";

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
  } = useSelector((state: RootState) => state.dashboardReducer);
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 500);
    }
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id && !currentSelectedDashboard) {

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      const to = params.get("to");
      const key = params.get("key");

      if (from && to && key) {
        const timeFrame = { ...timeFrames[key] };

        timeFrame.startDate = from;
        timeFrame.endDate = to;

        dispatch(setTimeFrame(timeFrame));
      }
      
      dispatch(getDashboardCards({ dashboardId: id }));
    } else {
      dispatch(getDashboardCards({ dashboardId: id }));
    }

  }, [currentSelectedDashboard, router, id, dashboards, dispatch]);


  useEffect(() => {
    dispatch(setCurrentDashboard(currentSelectedDashboard))
  }, [dispatch, currentSelectedDashboard])

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

  return currentSelectedDashboard ? (
    <>
      <div>
        <div className=" flex flex-col gap-3 md:flex-row md:gap-0 justify-between items-center">
          <div className=" flex flex-row gap-3 order-2 md:order-1 ">
            <DashboardMenu
              dashboardsList={dashboards}
              routingFunctionality={true}
            />
            {currentSelectedDashboard && dashboardCards.length !== 0 && (
              <TimeFrameMenu functionality={true} />
            )}
          </div>
          {isAdmin && (
            <div className="flex md:justify-center md:w-auto justify-end w-full  order-1 md:order-2">
              <span
                onClick={() => setIsModalOpen(true)}
                className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center"
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                Create New Card
              </span>
            </div>
          )}
        </div>
        {!(dashboardCards && dashboardCards.length > 0) ? (
          <EmptyDashboard />
        ) : (
          <div className="mt-3">
            <ResponsiveGridLayout
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
        )}
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
