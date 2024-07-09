"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input, Typography } from "antd";
import { useDispatch } from "react-redux";
import { login } from "@/app/store/slice/authSlice";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { NhsLogo } from "@/svgs/svgs";

const { Title } = Typography;

interface FormValues {
  email: string;
  password: string;
}

export default function MainLoginView() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const next = searchParams.get("next");

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      if (response.status === 200) {
        dispatch(login(response.data));
        router.push(next || "/dashboard");
      } else {
        toast.error("Error logging in to the system");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:h-screen md:mt-0 h-screen pt-12 md:pt-0 overflow-y-hidden">
      <div className="md:h-full md:flex md:justify-center md:items-center">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-36">
          <div className="w-64 md:w-96 mx-auto my-auto flex flex-col gap-10">
            <div>
              <Image
                src="/OriginLogo.svg"
                className="w-full h-full"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <div>
              {NhsLogo}
            </div>
          </div>
          <div>
            <div className="w-[350px] sm:w-[400px] md:w-96 mx-auto">
              <Title>Login</Title>
              <Form<FormValues>
                name="normal_login"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                layout="vertical"
                requiredMark="optional"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Email is Required",
                    },
                  ]}
                >
                  <Input
                    placeholder="example@gmail.com"
                    className="h-10"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is Required",
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="password"
                    className="h-10"
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: "0px" }}>
                  <Button
                    block
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className="h-10"
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
