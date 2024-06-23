"use client";
import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  createDashboard,
  deleteDashboard,
  updateDashboard,
  setCurrentDashboard,
} from "@/app/store/slice/dashboardSlice";
import { AppDispatch, RootState } from "@/app/store/store";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardType } from "@/type";
import { SelectSecondary } from "@/components/ui/Select/Select";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PrimaryInput } from "@/components/ui/Input/Input";
import { useRouter } from "next/navigation";
import { MdOutlineDashboard } from "react-icons/md";

interface DashboardTypeProps {
  dashboardsList: DashboardType[];
  routingFunctionality: boolean;
}

const DashboardMenu = ({
  dashboardsList,
  routingFunctionality,
}: DashboardTypeProps) => {
  const { currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);
  const [visible, setVisible] = useState(false);
  const [dashboards, setDashboards] = useState(dashboardsList || []);
  const [isCreating, setIsCreating] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (dashboardsList) {
      setDashboards(dashboardsList);
    }
  }, [dashboardsList]);

  const setDashboard = (dashboard: DashboardType) => {
    dispatch(setCurrentDashboard(dashboard));
    if (routingFunctionality) {
      router.push(`/dashboard/${dashboard.id}`);
    }
    setVisible(false);
  };

  const createDashboardHandler = () => {
    dispatch(createDashboard({ name: newDashboardName }));
    setIsCreating(false);
    setVisible(false);
  };

  const handleDeleteDashboard = (id: string) => {
    dispatch(deleteDashboard({ dashboardId: id }));
  };

  const handleEditDashboard = (dashboard: DashboardType) => {
    setEditingId(dashboard.id);
    setEditedName(dashboard.name);
  };

  const handleUpdateDashboard = () => {
    if (editingId) {
      dispatch(
        updateDashboard({ dashboardId: editingId, dashboardName: editedName })
      );
      setEditingId(null);
      setVisible(false);
    }
  };

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className={`${routingFunctionality ? "w-auto" : " w-44"}`}>
          {dashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              className="flex flex-row w-full justify-between gap-2"
            >
              {editingId === dashboard.id ? (
                <div className="flex flex-row items-center gap-2">
                  <PrimaryInput
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    onClick={handleUpdateDashboard}
                    className="px-2 py-1 rounded-md border border-green-100 hover:bg-green-100 duration-300 transition-all ease-in-out"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 rounded-md border border-red-100 hover:bg-red-100 duration-300 transition-all ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div
                    onClick={() => setDashboard(dashboard)}
                    className="p-2 flex-1 rounded-md cursor-pointer hover:bg-hover-primary flex flex-col justify-between gap-1 transition-all ease-in-out duration-300 hover:bg-gray-200"
                  >
                    <span className="!text-sm !text-black">
                      {dashboard.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-400">
                      {`${dashboard.devicesCount || "0"} sensors - ${
                        dashboard.cardsCount || "0"
                      } cards`}
                    </span>
                  </div>

                  {isAdmin && routingFunctionality && (
                    <>
                      <div
                        className="mt-2 group cursor-pointer"
                        onClick={() => handleEditDashboard(dashboard)}
                      >
                        <PencilSquareIcon
                          width={15}
                          className="group-hover:text-blue-600 duration-300 transition-all ease-in-out"
                        />
                      </div>
                      <div
                        className="mt-2 group cursor-pointer"
                        onClick={() => handleDeleteDashboard(dashboard.id)}
                      >
                        <TrashIcon
                          width={15}
                          className="group-hover:text-red-600 duration-300 transition-all ease-in-out"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
          {routingFunctionality && (
            <div className="bg-gray-300 my-2" style={{ height: "1px" }}></div>
          )}
          <div>
            {isAdmin && routingFunctionality && !isCreating && (
              <div
                onClick={() => setIsCreating(true)}
                className="flex gap-2 p-2 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer w-full hover:bg-gray-200 items-center"
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                <span>Create new dashboard</span>
              </div>
            )}
            {isCreating && (
              <div className="flex">
                <PrimaryInput
                  placeholder="Dashboard name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="!border !border-gray-200"
                />
                <button
                  disabled={newDashboardName.length < 3}
                  onClick={createDashboardHandler}
                  className="mini-button bg-transparent border-l-none px-3 disabled:cursor-not-allowed disabled:opacity-80 hover:bg-hover-primary transition-all ease-in-out duration-300"
                >
                  Create
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="mini-button bg-transparent border-l-none rounded-e-lg hover:bg-hover-primary transition-all ease-in-out duration-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      }
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <div className="inline-block shadow-sm rounded-lg !bg-white p-1 px-2">
        <SelectSecondary
          only={currentDashboard.name || "Select a Dashboard"}
          Icon={<MdOutlineDashboard className="w-5 h-5" />}
        />
      </div>
    </Popover>
  );
};

export default DashboardMenu;
