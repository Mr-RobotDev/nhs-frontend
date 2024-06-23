import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag, theme } from "antd";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { validateEmail, isValidTimeFormat } from "@/utils/helper_functions";
import { Select } from "antd";
import toast from "react-hot-toast";
import { AlertDataType, ReportsType } from "@/type";

const { Option } = Select;

interface CustomTagsProps {
  initialData: string[];
  type: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isAdmin: boolean;
}

const options = Array.from({ length: 25 }, (_, index) => {
  const hours = index.toString().padStart(2, "0");
  return (
    <Option key={hours + ":00"} value={hours + ":00"}>
      {hours + ":00"}
    </Option>
  );
});

const CustomTags = ({
  initialData,
  type,
  setFormData,
  isAdmin
}: CustomTagsProps) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState(initialData);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [selectedTime, setSelectedTime] = useState("00:00");

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    setTags(initialData);
  }, [initialData]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((email) => email !== removedTag);
    console.log(newTags);
    setTags(newTags);
    setFormData((prevState: any) => prevState ? { ...prevState, [type === 'email' ? 'recipients' : 'times']: [...newTags] } : null);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (type === "email") {

      if (!inputValue) {
        return;
      }

      const isValidEmail = validateEmail(inputValue);
      if (inputValue && tags.indexOf(inputValue) === -1 && isValidEmail) {
        console.log('Ypooo!')
        setTags([...tags, inputValue]);
        setInputValue("");

        setFormData(
          (prevState: any) =>
            prevState && {
              ...prevState,
              recipients: [...tags, inputValue],
            }
        );
      } else {
        toast.error("Please add a valid Email");
      }
    } else {
      const isValidTime = isValidTimeFormat(selectedTime);
      if (selectedTime && tags.indexOf(selectedTime) === -1 && isValidTime) {
        setTags([...tags, selectedTime]);
        setInputVisible(false);
        setInputValue("");
        setFormData(
          (prevState: any) =>
            prevState && {
              ...prevState,
              times: [...tags, selectedTime],
            }
        );
      } else {
        toast.error("Cannot add this to the list");
      }
    }
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div className=" flex flex-row flex-wrap gap-2 border-b border-b-blue-300 pb-2">
          {tags.map((tag) => (
            <div key={tag} className=" my-auto">
              <span

                className={` inline-block px-2 py-1 border border-gray-300 rounded-2xl ${isAdmin ? '' : 'opacity-75'}`}
              >
                <span className=" flex flex-row gap-2">
                  {tag}
                  {
                    isAdmin &&
                    <XCircleIcon
                      width={20}
                      className=" cursor-pointer"
                      onClick={() => handleClose(tag)}
                    />
                  }
                </span>
              </span>
            </div>
          ))}

          <>
            {isAdmin &&
              <div className=" flex items-center justify-center">
                {
                  type === "email" && (
                    <input
                      type="text"
                      style={{ width: 200 }}
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputConfirm}
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                          handleInputConfirm();
                        }
                      }}
                      className="!border-none focus:!outline-none"
                      placeholder={type === "email" ? "+ Add New Email" : "00:00"}
                    />
                  )
                }
                {inputVisible ? (
                  type === "time" && (
                    <div className=" flex items-center gap-2">
                      <Select
                        onChange={(value) => setSelectedTime(value)}
                        defaultValue="00:00"
                        style={{ width: 120 }}
                      >
                        {options}
                      </Select>
                      <button
                        onClick={handleInputConfirm}
                        className=" px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transform duration-300 transition-all"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setInputVisible(false)}
                        className=" px-3 py-1 rounded-md bg-slate-300 hover:bg-slate-400 text-gray-800  transform duration-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )
                ) : (
                  type === 'time' && (
                    <Tag
                      onClick={showInput}
                      className=" cursor-pointer"
                      style={tagPlusStyle}
                    >
                      <PlusOutlined />{" "}
                      Add Time
                    </Tag>
                  )

                )}
              </div>
            }
          </>
        </div>
      </div>
    </>
  );
};

export default CustomTags;
