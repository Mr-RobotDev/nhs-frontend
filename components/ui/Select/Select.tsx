import { useState } from "react";
import { Popover, Select } from "antd";

import classes from "./Select.module.css";

interface SelectSecondaryProps {
  pre?: string;
  post?: string;
  onClick?: () => void;
  only?: string;
  Icon?: React.ReactNode; // Now it can be null, undefined, or a React node
  disabled?: boolean;
}

const SelectSecondary: React.FC<SelectSecondaryProps> = ({
  pre = "",
  post = "",
  onClick = () => { },
  only = "",
  Icon = null,
  disabled = false,
}) => {
  return (
    <div
      className={` ${disabled ? classes.disabledSelectionMenu : ""
        } flex flex-row w-full gap-7 justify-between  h-[40px] items-center cursor-pointer px-3`}
      onClick={onClick}
    >
      <div className=" flex-1 overflow-hidden">
        <div className="flex flex-row gap-2 items-center w-full">
          {Icon && <div>{Icon}</div>}
          {only && (
            <div className="whitespace-nowrap overflow-hidden text-ellipsis" >
              <p className="whitespace-nowrap overflow-hidden text-ellipsis w-full !mb-0">{only}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 stroke-gray-600`}
        >
          <g id="fi:code">
            <path
              id="Vector"
              d="M6 16L12 22L18 16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M18 8L12 2L6 8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export { SelectSecondary };
