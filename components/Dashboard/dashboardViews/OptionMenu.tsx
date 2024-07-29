import { AppDispatch, RootState } from "@/app/store/store";
import { Popover } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { deleteCard } from "@/app/store/slice/dashboardSlice";

interface OptionMenuProps {
  cardId: string;
  setIsRenaming: Dispatch<SetStateAction<boolean>>;
  setGraphType: Dispatch<SetStateAction<string>>
  graphType: string
  noOfSensors: number
}

const OptionsMenu = ({ cardId, setIsRenaming, setGraphType, graphType, noOfSensors }: OptionMenuProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { currentDashboard } = useSelector(
    (state: RootState) => state.dashboardReducer
  );

  const changeGraphToHistogram = () => {
    setGraphType('histogram')
    setVisible(false);
  }

  const changeGraphToMotionNoMotion = () => {
    setGraphType('motion-nomotion')
    setVisible(false);
  }

  return (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={
        <div className="flex flex-col">
          <div
            className="flex gap-2 p-1 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
            onClick={() => {
              setVisible(false);
              setIsRenaming(true);
            }}
          >
            <span className="flex flex-col justify-center">
              <PencilSquareIcon width={15} />
            </span>
            <span className="!text-xs font-medium">Rename Card</span>
          </div>
          {
            noOfSensors === 1 &&
            <>
              {
                graphType !== 'histogram' && <div
                  className="flex gap-2 p-1 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
                  onClick={changeGraphToHistogram}
                >
                  <span className="flex flex-col justify-center">
                    <PencilSquareIcon width={15} />
                  </span>
                  <span className="!text-xs font-medium">Change to histogram</span>
                </div>
              }
              {
                graphType !== 'motion-nomotion' &&
                <div
                  className="flex gap-2 p-1 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
                  onClick={changeGraphToMotionNoMotion}
                >
                  <span className="flex flex-col justify-center">
                    <PencilSquareIcon width={15} />
                  </span>
                  <span className="!text-xs font-medium">Change to Motion / No Motion</span>
                </div>
              }
            </>
          }
          <div
            className="bg-slate-300 dark:bg-slate-700 my-2"
            style={{ height: "1px" }}
          ></div>
          <div
            className="flex gap-2 p-1 danger-menu transition-all ease-in-out duration-300 rounded-md cursor-pointer hover:bg-blue-50"
            onClick={() => {
              dispatch(
                deleteCard({ dashboardId: currentDashboard.id, cardId: cardId })
              );
            }}
          >
            <span className="flex flex-col justify-center">
              <XMarkIcon width={15} />
            </span>
            <span className="!text-xs font-medium">Remove Card</span>
          </div>
        </div>
      }
      trigger="click"
      placement="left"
      open={visible}
      onOpenChange={(visible) => setVisible(visible)}
    >
      <div className="flex flex-col justify-center">
        <div className="text-sm rounded-lg p-1 hover:bg-hover-primary transition-all ease-in-out duration-300">
          <EllipsisVerticalIcon width={20} className="!m-0" />
        </div>
      </div>
    </Popover>
  );
};

export default OptionsMenu;
