'use client'
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { SelectSecondary } from '../Select/Select';
import { Popover, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/lib/axiosInstance';
import { tranformObjectForSelectComponent } from '@/utils/helper_functions';
import debounce from 'lodash/debounce';
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper';

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
  clearInternalStateFlag?: boolean; // Add the flag prop
  onClearInternalState?: () => void; // Add the callback prop
  apiEndpoint?: string; // Make the API endpoint optional
  searchable?: boolean; // Add the searchable prop
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
  onClearInternalState,
  apiEndpoint, // Add the API endpoint prop
  searchable = false // Default to no search box
}: customMenuProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialValue);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectDisplayRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedTypes(initialValue)
  }, [initialValue])

  useEffect(() => {
    console.log('<----------------->')
    console.log('Options ->', options)
    console.log('selectedTypes ->', selectedTypes)
    console.log('initialValue ->', initialValue)
    console.log('<----------------->')
  }, [options, selectedTypes, initialValue])

  const clearInternalState = useCallback(() => {
    setSelectedTypes([]);
    if (onClearInternalState) {
      onClearInternalState();
    }
  }, [onClearInternalState]);

  useEffect(() => {
    if (selectDisplayRef.current) {
      setWidth(selectDisplayRef.current.offsetWidth);
    }
  }, [selectDisplayRef.current?.offsetWidth]);

  useEffect(() => {
    if (clearInternalStateFlag) {
      clearInternalState();
    }
  }, [clearInternalStateFlag, clearInternalState]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const fetchFilteredOptions = useCallback(async (query: string) => {
    if (apiEndpoint) {
      setLoading(true);
      const response = await axiosInstance.get(`${apiEndpoint}&search=${query}`);
      setFilteredOptions(tranformObjectForSelectComponent(response.data.results));
      setLoading(false);
    } else {
      setFilteredOptions(
        options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }, [apiEndpoint, options]);

  const debouncedFetchFilteredOptions = useMemo(
    () => debounce(fetchFilteredOptions, 500),
    [fetchFilteredOptions]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetchFilteredOptions(query);
  };

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
      setSearchQuery('');
    }
  }, [handleTypeChange, isAdmin, multiple]);

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
      {searchable && (
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-2"
        />
      )}
      <LoadingWrapper loading={loading} size='small'>
        <div className="flex flex-col max-h-[90px] overflow-y-scroll">
          {filteredOptions.map(option => (
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
          {createNewRoom && (
            <div className=' pt-2' onClick={handleCreateNewRoom}>
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
            </div>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );

  return isAdmin ? (
    <Popover
      className=''
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
