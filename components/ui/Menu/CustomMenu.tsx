'use client'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { SelectSecondary } from '../Select/Select';
import { Divider, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

interface customMenuProps {
  handleTypeChange: (values: string[]) => void;
  initialValue?: string[];
  isAdmin: boolean;
  options: Array<{
    label: string;
    value: string;
  }>;
  createNewRoom?: boolean;
  handleCreateNewRoomModalShow?: () => void;
  multiple?: boolean; // Add the multiple prop
  clearInternalStateFlag: boolean; // Add the flag prop
  onClearInternalState: () => void; // Add the callback prop
}

const CustomMenu = ({
  handleTypeChange,
  initialValue = [],
  isAdmin,
  options,
  createNewRoom,
  handleCreateNewRoomModalShow,
  multiple = true,
  clearInternalStateFlag,
  onClearInternalState
}: customMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialValue);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const selectDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectDisplayRef.current) {
      setWidth(selectDisplayRef.current.offsetWidth);
    }
  }, [selectDisplayRef.current?.offsetWidth]);

  const handleScheduleTimeClick = useCallback((value: string) => {
    if (isAdmin) {
      setSelectedTypes((prevSelected) => {
        if (multiple) {
          const isSelected = prevSelected.includes(value);
          const newSelected = isSelected
            ? prevSelected.filter((type) => type !== value)
            : [...prevSelected, value];
          handleTypeChange(newSelected);
          return newSelected;
        } else {
          handleTypeChange([value]);
          return [value];
        }
      });
      setVisible(false);
    }
  }, [handleTypeChange, isAdmin, multiple]);

  const clearInternalState = useCallback(() => {
    setSelectedTypes([]);
    onClearInternalState(); // Notify the parent that the internal state is cleared
  }, [onClearInternalState])

  useEffect(() => {
    if (clearInternalStateFlag) {
      clearInternalState();
    }
  }, [clearInternalStateFlag, clearInternalState]);

  const handleCreateNewRoom = () => {
    if (handleCreateNewRoomModalShow) {
      handleCreateNewRoomModalShow();
      setVisible(false);
    }
  };

  const selectDisplay = (
    <div ref={selectDisplayRef} className={`inline-block cursor-pointer shadow-sm rounded-lg !bg-white p-1 px-2 w-full ${!isAdmin ? "opacity-50" : ""}`}>
      <div className="flex flex-row">
        <SelectSecondary
          only={selectedTypes.map(type => options.find(opt => opt.value === type)?.label).join(', ')}
          disabled={!isAdmin}
        />
      </div>
    </div>
  );

  const popoverContent = (
    <div className="w-full">
      <div className="flex flex-col">
        {options.map(option => (
          <div
            key={option.value}
            className={`flex gap-2 p-2 hover:bg-blue-100 transition-all ease-in-out duration-300 rounded-md cursor-pointer ${!isAdmin ? "pointer-events-none" : ""}`}
            onClick={() => handleScheduleTimeClick(option.value)}
          >
            <span className="flex flex-col justify-center w-[6px]">
              <span
                className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${selectedTypes.includes(option.value) ? "visible" : "hidden"}`}
              ></span>
            </span>
            <span className="text-sm font-medium !text-black">{option.label}</span>
          </div>
        ))}
        {createNewRoom && <div className=' pt-2' onClick={handleCreateNewRoom}>
          <hr />
          {isAdmin && (
            <div
              className="flex gap-2 p-2 hover:bg-hover-primary transition-all ease-in-out duration-300 rounded-md cursor-pointer w-full hover:bg-gray-200 items-center"
            >
              <span
                className={`w-[6px] h-[6px]  "hidden"}`}
              ></span>
              <FontAwesomeIcon icon={faCirclePlus} />
              <span>Create New Room</span>
            </div>
          )}
        </div>}
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
      overlayStyle={{ width: width }}
    >
      {selectDisplay}
    </Popover>
  ) : (
    selectDisplay
  );
};

CustomMenu.displayName = 'CustomMenu';

export default CustomMenu;
