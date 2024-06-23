import React, { useEffect, useState } from "react";
import { Table, TableProps } from "antd";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

interface PrimaryTableProps<T> extends TableProps<T> {
  columns: any[];
  records: T[];
  isLoading: boolean;
  total?: number;
  handleChange?: (page: number, pageSize: number) => void;
  handleRowClick?: (record: T) => React.HTMLAttributes<HTMLElement>;
  showPagination?: boolean;
  showSizeChanger?: boolean;
  rowClassName?: string;
  defaultPageSize?: number;
  pageSizeOptions?: string[];
  scroll?: any;
  current?: number;
  showRowSelection?: boolean;
  rowSelection?: any;
}

const PrimaryTable = <T extends object>({
  columns,
  records,
  isLoading,
  total = 0,
  handleChange = (page, pageSize) => {},
  handleRowClick = (record) => ({}),
  showPagination = false,
  showSizeChanger = false,
  rowClassName = "cursor-pointer",
  defaultPageSize = 10,
  pageSizeOptions = ["5", "10", "20", "30", "50", "100"],
  scroll = {},
  current = 1,
  showRowSelection = false,
  rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {},
  },
}: PrimaryTableProps<any>) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: current,
      showSizeChanger,
      total: total,
      defaultPageSize,
      pageSizeOptions,
      size: "small" as const,
    },
  });

  useEffect(() => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        total,
      },
    }));
  }, [total]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    handleChange(pagination.current, pagination.pageSize);
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record?.id || record?.key || record?.cloudpopId}
      dataSource={records}
      pagination={showPagination ? tableParams.pagination : false}
      loading={isLoading}
      onChange={handleTableChange}
      onRow={handleRowClick}
      rowClassName={rowClassName}
      scroll={scroll}
      rowSelection={
        showRowSelection
          ? {
              getCheckboxProps: (record: any) => ({}),
              type: "checkbox",
              ...rowSelection,
            }
          : undefined
      }
    />
  );
};

export const TypeComponentVariants = {
  sensor: "sensor",
  account: "account",
} as const;

interface TypeComponentProps {
  type?: string;
  className?: string;
  variant?: keyof typeof TypeComponentVariants;
}

const TypeComponent: React.FC<TypeComponentProps> = ({
  className = "py-1.5 px-1.5 w-5 h-5",
  variant = TypeComponentVariants.sensor,
}) => {
  let Icon: JSX.Element | null = null;
  let bgColor: string | null = null;

  return (
    <div
      className={`sensor-type inline-flex items-center justify-center bg-[var(--neutral-background)] border border-primary-900 rounded-md ${className}`}
      style={{ border: `1px solid ` }}
    >
      {Icon}
    </div>
  );
};

interface SignalComponentProps {
  signal?: number;
}

const SignalComponent: React.FC<SignalComponentProps> = ({ signal = 0 }) => {
  const maxSignal = 5;
  const exactSignal = signal / 20; // This will give us a floating point number between 0-5
  const backgroundColor = "#e5e7eb";
  const highSignalColor = "#10b981"; // green
  const mediumSignalColor = "#ECC94B"; // yellowish
  const lowSignalColor = "#E53E3E"; // red
  const isOffline = signal === 0;

  const getForegroundColor = (signal: number) => {
    if (signal <= 15) {
      return lowSignalColor;
    } else if (signal <= 30) {
      return mediumSignalColor;
    } else {
      return highSignalColor;
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "row",
        position: "relative",
        alignItems: "end",
      }}
    >
      {isOffline && (
        <FontAwesomeIcon
          icon={faTimesCircle}
          style={{ position: "absolute", top: -3, left: 0 }}
          className="danger-icon"
        />
      )}
      {Array.from({ length: maxSignal }, (_, i) => {
        const signalAtThisCell = exactSignal - i;
        const percentage = Math.min(100, Math.max(0, signalAtThisCell * 100));
        const foregroundColor = getForegroundColor(signal);
        return (
          <div
            key={i}
            style={{
              width: "3px",
              height: `${4 * (i + 1)}px`,
              background: `linear-gradient(to top, ${foregroundColor} 0%, ${foregroundColor} ${percentage}%, ${backgroundColor} ${percentage}%, ${backgroundColor} 100%)`,
              marginRight: "3px",
            }}
          />
        );
      })}
    </div>
  );
};

export { PrimaryTable, TypeComponent, SignalComponent };
