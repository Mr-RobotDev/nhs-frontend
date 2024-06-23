"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Layout, Drawer, Affix } from "antd";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import "antd/dist/reset.css";
import "@/styles/main.css";
import "@/styles/responsive.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

const { Header: AntHeader, Content, Sider } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<"left" | "right">("right");
  const [sidenavColor, setSidenavColor] = useState("#111111");
  const [sidenavType, setSidenavType] = useState<"transparent" | "#fff">(
    "transparent"
  );
  const openDrawer = () => setVisible(!visible);
  const { fullScreen } = useSelector((state: RootState) => state.dashboardReducer)

  const pathname = usePathname()?.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  return (
    fullScreen ? (
      <Layout>
        <Content className="content-ant">{children}</Content>
      </Layout>
    )
      : (
        <Layout
          className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""
            } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
        >
          <Drawer
            title={false}
            placement={placement === "right" ? "left" : "right"}
            closable={false}
            onClose={() => setVisible(false)}
            open={visible}
            key={placement === "right" ? "left" : "right"}
            width={250}
            className={`drawer-sidebar ${pathname === "rtl" ? "drawer-sidebar-rtl" : ""
              } `}
          >
            <Layout
              className={`layout-dashboard !p-0 ${pathname === "rtl" ? "layout-dashboard-rtl" : ""
                }`}
            >
              <Sider
                trigger={null}
                width={250}
                theme="light"
                className={`sider-primary ant-layout-sider-primary ${sidenavType === "#fff" ? "active-route" : ""
                  }`}
                style={{ background: sidenavType }}
              >
                <Sidebar color={sidenavColor} />
              </Sider>
            </Layout>
          </Drawer>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            trigger={null}
            width={250}
            theme="light"
            className={`sider-primary ant-layout-sider-primary !p-0 ${sidenavType === "#fff" ? "active-route" : ""
              }`}
            style={{ background: sidenavType }}
          >
            <Sidebar color={sidenavColor} />
          </Sider>
          <Layout>
            <div className="sidebar-toggler py-3 lg:hidden" onClick={openDrawer}>
              {toggler}
            </div>
            <Content className="content-ant">{children}</Content>
          </Layout>
        </Layout>
      )
  );
};

export default DashboardLayout;
