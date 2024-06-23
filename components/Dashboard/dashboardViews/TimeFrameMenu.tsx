import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { SelectSecondary } from "@/components/ui/Select/Select";
import { setTimeFrame } from "@/app/store/slice/dashboardSlice";
import timeFrames from "@/utils/time_frames";
import { RootState } from "@/app/store/store";
import { TimeFrameType } from "@/type";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface TimeFrameProps {
  functionality: boolean;
  initialValue?: string;
  isAdmin?: boolean;
}

const TimeFrameMenu = ({ functionality, initialValue, isAdmin= true }: TimeFrameProps) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { timeFrame } = useSelector((state: RootState) => state.dashboardReducer);

  const handleTimeFrame = (selectedTimeFrame: TimeFrameType) => {
    dispatch(setTimeFrame(selectedTimeFrame));
    setVisible(false);
  };

  useEffect(() => {
    if (functionality) {
      const { startDate, endDate, key } = timeFrame;
      const url = new URL(window.location.href);
      url.searchParams.set("from", startDate);
      url.searchParams.set("to", endDate);
      url.searchParams.set("key", key);
      window.history.replaceState({}, "", url.toString());
    }
  }, [timeFrame, functionality]);

  useEffect(() => {
    if (initialValue) {
      dispatch(setTimeFrame(timeFrames[initialValue]));
    }
  }, [initialValue, dispatch]);

  const TimeFrameOption = ({ frameKey }: { frameKey: string }) => {
    const frame = timeFrames[frameKey];
    return (
      <div
        className="flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer"
        onClick={() => handleTimeFrame(frame)}
      >
        <span className="flex flex-col justify-center w-[6px]">
          <span
            className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${timeFrame.key === frame.key ? "visible" : "hidden"
              }`}
          ></span>
        </span>
        <span className="text-sm font-medium !text-black">{frame.title}</span>
      </div>
    );
  };

  const displayContent = (
    <div className="w-[170px] flex flex-col">
      {Object.keys(timeFrames).map((key, index) => (
        <React.Fragment key={key}>
          {index === 2 || index === 4 ? <div className="bg-slate-300 dark:bg-slate-700 my-2" style={{ height: "1px" }}></div> : null}
          <TimeFrameOption frameKey={key} />
        </React.Fragment>
      ))}
    </div>
  );

  return isAdmin ? (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={displayContent}
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={setVisible}
    >
      <div className="inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-full">
        <div className="flex flex-row gap-2">
          <SelectSecondary
            only={timeFrame.title}
            Icon={<CalendarDaysIcon width={20} />}
          />
        </div>
      </div>
    </Popover>
  ) : (
    <div className="inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-full opacity-50 cursor-not-allowed">
      <div className="flex flex-row gap-2">
        <SelectSecondary
          only={timeFrame.title}
          Icon={<CalendarDaysIcon width={20} />}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default TimeFrameMenu;
