"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Button, Drawer, Typography, Switch } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { usePathname } from "next/navigation";

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

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

interface HeaderProps {
  placement: "left" | "right";
  name: string;
  subName: string;
  onPress: () => void;
  handleSidenavColor: (color: string) => void;
  handleSidenavType: (type: "transparent" | "#fff") => void;
  handleFixedNavbar: (type: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  placement = "left",
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) => {
  const { Title, Text } = Typography;

  const { user } = useSelector((state: RootState) => state.authReducer);
  const page = usePathname().split("/").at(-1);
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState<"transparent" | "#fff">(
    "transparent"
  );

  useEffect(() => window.scrollTo(0, 0), []);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col
          span={24}
          md={18}
          className=" !flex !items-center gap-3 !justify-start !p-0"
        >
          <div className=" flex items-start justify-start lg:hidden">
            <div className="sidebar-toggler" onClick={onPress}>
              {toggler}
            </div>
          </div>
          <Drawer
            className="settings-drawer"
            mask={true}
            width={360}
            onClose={hideDrawer}
            placement={"right"}
            open={visible}
          >
            <div>
              <div className="header-top">
                <Title level={4}>
                  Configurator
                  <Text className="subtitle">See our dashboard options.</Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Title level={5}>Sidebar Color</Title>
                <div className="theme-color mb-2">
                  <ButtonContainer>
                    <button
                      className="bg-[#1890ff] rounded-sm"
                      onClick={() => handleSidenavColor("#1890ff")}
                    ></button>
                    <button
                      className="bg-[#52c41a] rounded-sm"
                      onClick={() => handleSidenavColor("#52c41a")}
                    ></button>
                    <button
                      className="bg-[#d9363e] rounded-sm"
                      onClick={() => handleSidenavColor("#d9363e")}
                    ></button>
                    <button
                      className="bg-[#fadb14] rounded-sm"
                      onClick={() => handleSidenavColor("#fadb14")}
                    ></button>
                    <button
                      className="bg-[#111111] rounded-sm"
                      onClick={() => handleSidenavColor("#111")}
                    ></button>
                  </ButtonContainer>
                </div>

                <div className="sidebarnav-color mb-2">
                  <Title level={5}>Sidenav Type</Title>
                  <Text>Choose between 2 different sidenav types.</Text>
                  <ButtonContainer className="trans">
                    <Button
                      type={
                        sidenavType === "transparent" ? "primary" : "default"
                      }
                      onClick={() => {
                        handleSidenavType("transparent");
                        setSidenavType("transparent");
                      }}
                    >
                      TRANSPARENT
                    </Button>
                    <Button
                      type={sidenavType === "#fff" ? "primary" : "default"}
                      onClick={() => {
                        handleSidenavType("#fff");
                        setSidenavType("#fff");
                      }}
                    >
                      WHITE
                    </Button>
                  </ButtonContainer>
                </div>
                <div className="fixed-nav mb-2">
                  <Title level={5}>Navbar Fixed </Title>
                  <Switch onChange={(e) => handleFixedNavbar(e)} />
                </div>
              </div>
            </div>
          </Drawer>
        </Col>
      </Row>
    </>
  );
};

export default Header;
