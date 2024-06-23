import React, { useState } from "react";
import { Modal, Button, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCard } from "@/app/store/slice/dashboardSlice";
import DevicesSelector from "../Modals/DeviceSelector";
import SensorSelector from "../Modals/SensorSelector";
import CardDetails from "../Modals/CardDetails";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CardOptionsType } from "@/type";
import { AppDispatch, RootState } from "@/app/store/store";

const headings: { [key: number]: string } = {
  0: "Select Devices",
  1: "Select",
  2: "Set Card Options",
};

const cardOptions: CardOptionsType = {
  TWO_X_TWO: {
    key: "two_x_two",
    rows: 2,
    cols: 2,
  },
  TWO_X_THREE: {
    key: "two_x_three",
    rows: 3,
    cols: 2,
  },
  TWO_X_FOUR: {
    key: "two_x_four",
    rows: 4,
    cols: 2,
  },
  THREE_X_TWO: {
    key: "three_x_two",
    rows: 2,
    cols: 3,
  },
  THREE_X_THREE: {
    key: "three_x_three",
    rows: 3,
    cols: 3,
  },
  THREE_X_FOUR: {
    key: "three_x_four",
    rows: 4,
    cols: 3,
  },
  FOUR_X_FOUR: {
    key: "four_x_four",
    rows: 4,
    cols: 4,
  },
};

interface AddCardModalProps {
  dashboardId: string;
  isVisible: boolean;
  onClose: () => void;
}

const AddCardModal = ({
  dashboardId,
  isVisible,
  onClose,
}: AddCardModalProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [cardName, setCardName] = useState("");
  const [step, setStep] = useState(0);
  const [cardOption, setCardOption] = useState(cardOptions.TWO_X_TWO);
  const dispatch: AppDispatch = useDispatch();
  const error = useSelector((state: RootState) => state.dashboardReducer.error);
  const { devices } = useSelector((state: RootState) => state.devicesReducer)

  const resetState = () => {
    setSelectedRowKeys([]);
    setSelectedSensors([]);
    setCardName("");
    setStep(0);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCreateCard = () => {
    setStep(1);
  };

  const handleGoBack = () => {
    setStep((prevState) => prevState - 1);
  };

  const handleAddCardToDashboard = async () => {
    if (dashboardId) {
      await dispatch(
        createCard({
          dashboard: dashboardId,
          cardName: cardName,
          cols: cardOption.cols,
          rows: cardOption.rows,
          devices: selectedRowKeys,
        })
      );
      if (error) {
        console.log(error);
      } else {
        resetState();
        onClose();
      }
    }
  };

  return (
    <Modal
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={700}
      footer={[]}
    >
      <h3 className=" font-semibold text-xl text-center">{headings[step]}</h3>
      <div className=" !h-[600px] overflow-y-auto py-3">
        {step === 0 && (
          <DevicesSelector
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        )}
        {step === 1 && (
          <CardDetails
            cardOption={cardOption}
            setCardOption={setCardOption}
            cardOptions={cardOptions}
            cardName={cardName}
            setCardName={setCardName}
          />
        )}

      </div>
      <Divider className=" h-[1px] bg-gray-100 !m-0" />
      <div className=" my-5 flex justify-between">
        {step === 0 ? (
          <div></div>
        ) : (
          <Button
            type="dashed"
            onClick={handleGoBack}
            className=" flex flex-row gap-2 items-center"
          >
            <ArrowLeftIcon width={15} />
            <p className="!mb-0">Go Back</p>
          </Button>
        )}

        {selectedRowKeys.length > 0 && step === 0 && (
          <Button onClick={handleCreateCard} type="default">
            Set Card Options
          </Button>
        )}

        {step === 1 && cardName !== "" && (
          <Button onClick={handleAddCardToDashboard} type="default">
            Add to Dashboard
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default AddCardModal;
