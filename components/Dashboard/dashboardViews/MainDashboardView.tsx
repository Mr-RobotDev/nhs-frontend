"use client";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import { useEffect, useState } from "react";
import {
  getDashboardCards,
  getDashboards,
  setCurrentDashboard,
} from "@/app/store/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import DashboardMenu from "@/components/Dashboard/dashboardViews/DashboardMenu";
import NoDashboardSelected from "./NoDashboardSelected";
import { useRouter } from "next/navigation";

const MainDashboardView = () => {
  const dispatch: AppDispatch = useDispatch();
  const [firstDashboard, setFirstDashboard] = useState();
  const router = useRouter();

  const { dashboards, currentDashboard: currentSelectedDashboard } =
    useSelector((state: RootState) => state.dashboardReducer);

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  useEffect(() => {
    if (currentSelectedDashboard.id !== "") {
      router.push(`/dashboard/${currentSelectedDashboard.id}`);
      dispatch(getDashboardCards({ dashboardId: currentSelectedDashboard.id }));
    }
  }, [currentSelectedDashboard, dispatch, router]);

  return (
    <>
      {currentSelectedDashboard.id === '' &&
        <>
          <div className="flex justify-between flex-wrap gap-2">
            <div className=" w-full sm:w-60">
              <p className=" text-sm mb-1">Current Dashboard</p>
              <DashboardMenu
                dashboardsList={dashboards}
                routingFunctionality={true}
              />
            </div>
          </div>
          <NoDashboardSelected />
        </>
      }
    </>
  );
};

export default withDashboardLayout(MainDashboardView);
