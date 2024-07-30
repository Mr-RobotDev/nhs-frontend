"use client";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import { Card, Col, Row } from "antd";
import LeafLetMap from "./LeafLetMap";
import FullScreenButton from "@/components/ui/FullScreenButton/FullScreenButton";

const MainFloorView = () => {

  return (
    <>
      <div className=" flex items-center justify-between mb-3">
        <h1 className=" text-3xl font-semibold">Floor Plan</h1>
        <FullScreenButton />
      </div>
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <Card>
            <LeafLetMap />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withDashboardLayout(MainFloorView);
