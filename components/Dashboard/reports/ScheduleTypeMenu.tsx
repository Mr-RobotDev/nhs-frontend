import React, { useState, useCallback } from "react";
import { Popover } from "antd";
import { SelectSecondary } from "@/components/ui/Select/Select";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { scheduletypeOptions } from "@/utils/form";

interface ScheduleTypeMenuProps {
  handleScheduleTypeChange: (value: string) => void;
  initialScheduleType?: string;
  isAdmin: boolean;
}

const ScheduleTypeMenu = ({ handleScheduleTypeChange, initialScheduleType = 'weekdays', isAdmin }: ScheduleTypeMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [scheduleType, setScheduleType] = useState(initialScheduleType);

  const handleScheduleTimeClick = useCallback((value: string) => {
    if (isAdmin) {  // Ensure changes only occur if the user is admin
      setScheduleType(value);
      setVisible(false);
      handleScheduleTypeChange(value);
    }
  }, [handleScheduleTypeChange, isAdmin]);

  const selectDisplay = (
    <div className={`inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-[200px] ${!isAdmin ? "opacity-50" : ""}`}>
      <div className="flex flex-row gap-2">
        <SelectSecondary
          only={scheduletypeOptions.find(option => option.value === scheduleType)?.label}
          Icon={<CalendarIcon width={20} />}
          disabled={!isAdmin}  // Disable interaction if not admin
        />
      </div>
    </div>
  );

  const popoverContent = (
    <div className="w-[200px]">
      <div className="flex flex-col">
        {['everyday', 'weekdays', 'custom'].map(type => (
          <div
            key={type}
            className={`flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer ${!isAdmin ? "pointer-events-none" : ""}`}
            onClick={() => handleScheduleTimeClick(type)}
          >
            <span className="flex flex-col justify-center w-[6px]">
              <span
                className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${scheduleType === type ? "visible" : "hidden"}`}
              ></span>
            </span>
            <span className="text-sm font-medium !text-black">{scheduletypeOptions.find(opt => opt.value === type)?.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return isAdmin ? (
    <Popover
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      content={popoverContent}
      trigger="click"
      placement="bottomLeft"
      open={visible}
      onOpenChange={setVisible}
    >
      {selectDisplay}
    </Popover>
  ) : (
    selectDisplay
  );
};

export default ScheduleTypeMenu;
