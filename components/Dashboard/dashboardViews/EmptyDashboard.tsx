"use client";
import { useState } from "react";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import AddCardModal from "../Modals/AddCardModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const EmptyDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useSelector((state: RootState) => state.authReducer);
  const { currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-center md:mt-36 mt-24">
        <div>
          <div className="flex justify-center">
            <div className="empty-boxes">
              <div className="content-box empty-box animate-1"></div>
              <div className="content-box empty-box"></div>
              <div className="content-box empty-box"></div>
              <div className="content-box empty-box animate-2"></div>
            </div>
          </div>
          <div className="font-semibold text-center mt-2 text-xl">
            Empty Dashboard
          </div>
          <div className="!text-sm !text-black font-light text-secondary-300 text-center mt-3">
            Create an overview and visualize sensor data by adding cards
          </div>
          {isAdmin && (
            <div className="flex justify-center mt-3">
              <span
                onClick={showModal}
                className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-custom-nhs-blue text-white hover:bg-blue-600 transition-all ease-in-out duration-300 flex gap-2 items-center"
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                Create New Card
              </span>
            </div>
          )}
        </div>
        <AddCardModal
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dashboardId={currentDashboard.id}
        />
      </div>
    </>
  );
};

export default EmptyDashboard;
