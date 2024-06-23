import { Input } from "antd";
import { ReactNode } from "react";
import classes from "./Input.module.css";

interface PrimaryInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  autoComplete?: string;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
}

const PrimaryInput: React.FC<PrimaryInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  className,
  autoComplete = "off",
  defaultValue,
  disabled = false,
  name,
}) => {
  return (
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`${classes.primaryInput} ${className}`}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};

interface PrimaryPasswordInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const PrimaryPasswordInput: React.FC<PrimaryPasswordInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}) => {
  return (
    <Input.Password
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${classes.primaryPasswordInput} ${className}`}
    />
  );
};

interface PrimaryInputWithIconProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: ReactNode;
  autoComplete?: string;
}

const PrimaryInputWithIcon: React.FC<PrimaryInputWithIconProps> = ({
  type,
  placeholder,
  value,
  defaultValue = "",
  onChange,
  className,
  icon,
  autoComplete = "off",
}) => {
  return (
    <Input
      type={type}
      prefix={icon}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`${classes.primarySearchInput} ${className}`}
      autoComplete={autoComplete}
    />
  );
};

export { PrimaryInput, PrimaryPasswordInput, PrimaryInputWithIcon };
