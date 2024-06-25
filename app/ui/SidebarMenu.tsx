import Link from "next/link";
import React from "react";

interface SidebarMenuProps {
  title: string;
  icon: any;
  key: string;
  isActive: boolean;
  url: string;
}

const SidebarMenu = ({
  title,
  icon,
  key,
  isActive,
  url,
}: SidebarMenuProps) => {
  return (
    <div
      key={key}
      className={`!w-auto !rounded-none py-2 transform duration-150 transition-all !px-5 ${
        isActive
          ? " bg-blue-100 border-l-[6px] border-l-custom-nhs-blue"
          : "hover:bg-blue-50"
      }`}
    >
      <Link href={url} className="w-full">
        <div className="flex flex-row gap-3 items-center py-1">
          <div>{icon}</div>
          <span
            className={`label !text-base ${
              isActive ? " text-custom-nhs-blue font-semibold" : "text-black"
            } `}
          >
            {title}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default SidebarMenu;
