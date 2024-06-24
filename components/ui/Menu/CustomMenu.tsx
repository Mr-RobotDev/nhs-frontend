'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { SelectSecondary } from '../Select/Select';
import { Popover } from 'antd';

interface customMenuProps {
  handleTypeChange: (value: string) => void;
  initialValue?: string
  isAdmin: boolean;
  options: Array<{
    label: string;
    value: string;
  }>
}

const CustomMenu = ({ handleTypeChange, initialValue, isAdmin, options }: customMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(initialValue || '');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const selectDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectDisplayRef.current) {
      setWidth(selectDisplayRef.current.offsetWidth);
    }
  }, [selectDisplayRef.current?.offsetWidth]);

  const handleScheduleTimeClick = useCallback((value: string) => {
    if (isAdmin) {
      setType(value);
      setVisible(false);
      handleTypeChange(value);
    }
  }, [handleTypeChange, isAdmin]);

  const selectDisplay = (
    <div ref={selectDisplayRef} className={`inline-block shadow-sm rounded-lg !bg-white p-1 px-2 w-full ${!isAdmin ? "opacity-50" : ""}`}>
      <div className="flex flex-row">
        <SelectSecondary
          only={options.find(opt => opt.value === initialValue)?.label}
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
                className={`w-[6px] h-[6px] rounded-[50%] bg-blue-600 ${type === option.value ? "visible" : "hidden"}`}
              ></span>
            </span>
            <span className="text-sm font-medium !text-black">{option?.label}</span>
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
      overlayStyle={{ width: width }}
    >
      {selectDisplay}
    </Popover>
  ) : (
    selectDisplay
  );
}

export default CustomMenu;
