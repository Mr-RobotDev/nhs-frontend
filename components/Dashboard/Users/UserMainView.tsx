"use client";
import React, { useEffect, useState } from "react";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import {
  Button,
  Modal,
  Table,
  TableProps,
  Tag,
  Form,
  Input,
  Select,
  Card,
} from "antd";
import axiosInstance from "@/lib/axiosInstance";
import { User } from "@/type";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { UserSwitchOutlined } from "@ant-design/icons";
import { formatToTitleCase } from "@/utils/helper_functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import CustomMenu from "@/components/ui/Menu/CustomMenu";
import { userOrganizationOptions, userRoleOptions } from "@/utils/form";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";

const initialUserState: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "User",
  organization: "Origin Smart",
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const UserMainView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>(initialUserState);
  const [form] = Form.useForm();
  const { user: loggedInUser } = useSelector((state: RootState) => state.authReducer)
  const router = useRouter()

  const columns: TableProps<any>["columns"] = [
    {
      title: "User",
      dataIndex: "user",
      render: (_, { firstName, profile, lastName }) => {
        return (
          <div className="flex gap-2 items-center">
            <div className=" w-12 h-12">
              <Image
                src={profile ? profile : "/dummyAvatar.png"}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
                unoptimized
                width={100}
                height={100}
              />
            </div>
            <div>
              <p className="!text-sm !text-[#000000e0]">
                {firstName + " " + lastName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Organization",
      key: "organization",
      dataIndex: "organization",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (_, { role }) => {
        let color = role === "User" ? "geekblue" : "volcano";
        return (
          <div className="flex">
            <div className="w-16">
              <Tag color={color}>{formatToTitleCase(role)}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "aactions",
      render: (_, { id, role }) => {
        return (
          <div className=" flex flex-row gap-4 items-center">
            <p
              onClick={() => changeUserRole(id, role)}
              className="!text-blue-500 hover:text-blue-600 duration-200 transition-all transform cursor-pointer flex flex-row gap-2 items-center"
            >
              <span>Change Role</span>
              <UserSwitchOutlined />
            </p>
            <Link target="_blank" href={`/dashboard/users/${id}/activity-logs`}>
              <div className="group px-2 py-1 text-blue-500 hover:text-blue-600 duration-150 transition-all transform rounded-md flex flex-row gap-1">
                Activity Logs
                <ArrowUpRightIcon
                  width={16}
                  className="transform transition-transform duration-150"
                />
              </div>
            </Link>
          </div>
        );
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const changeUserRole = async (userId: string, role: string) => {
    const newRole = role === "User" ? "Admin" : "User";
    try {
      const response = await axiosInstance.patch(
        `/users/${userId}/update-role`,
        { role: newRole }
      );
      if (response.status === 200) {
        setUsers((prevState) => {
          return prevState.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          );
        });
        toast.success("User role changed successfully");
      } else {
        toast.error("Error changing user role");
      }
    } catch (error) {
      console.log("error ->", error);
      toast.error("Error changing user role");
    }
  };

  const handleOk = async () => {
    try {
      delete user.id
      const response = await axiosInstance.post("/users", user);
      if (response.status === 200) {
        setUsers((prevUsers) => [...prevUsers, response.data.user]);
        toast.success("User created successfully");
        setIsModalOpen(false);
      } else {
        console.log("Error creating user:", response);
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setUser(initialUserState);
      form.resetFields()
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser?.role !== 'Admin') {
      router.push('/dashboard/floor')
    }
  }, [router, loggedInUser])

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/users");
        if (response.status === 200) {
          setUsers(response.data.results);
          console.log(response);
        } else {
          console.log("error ->", response);
        }
      } catch (error: any) {
        console.log("error ->", error);
      } finally {
        setIsModalOpen(false);
      }
    })();
  }, []);

  const handlePagination = (page: number) => {
    console.log(page);
  };

  return (
    loggedInUser?.role === 'Admin' && <Card>
      <div className=" flex flex-row justify-between items-center">
        <div className=" flex items-center justify-center my-auto">
          <h1 className="text-3xl font-semibold !mb-0">Users</h1>
        </div>
        <div>
          <div
            className="flex justify-center"
            onClick={showModal}
          >
            <span className="button_ready-animation cursor-pointer !text-sm border-2 rounded-lg py-[10px] px-3 bg-blue-600 text-white hover:bg-blue-700 transition-all ease-in-out duration-300 flex gap-2 items-center">
              <FontAwesomeIcon icon={faCirclePlus} />
              Create New User
            </span>
          </div>
        </div>
      </div>

      <div className=" mt-6">
        <Table
          columns={columns}
          dataSource={users}
          scroll={{ x: 500 }}
          loading={users.length === 0}
          pagination={{
            onChange: handlePagination,
          }}
        />
      </div>
      <Modal
        title="Create New User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create User"
        cancelText="Cancel"
      >
        <div>
          <Form
            {...formItemLayout}
            form={form}
            variant="filled"
            style={{ maxWidth: 600 }}
          >
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <Input onChange={(e) => setUser({ ...user, firstName: e.target.value })} value={user.firstName} />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="custom-form-item"
              >
                <Input onChange={(e) => setUser({ ...user, lastName: e.target.value })} value={user.lastName} />
              </Form.Item>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="custom-form-item"
            >
              <Input type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} value={user.email} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please add the password" }]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              className="custom-form-item"
            >
              <Input type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} value={user.password} />
            </Form.Item>

            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2 !mb-8">
              <div>
                <label>Role</label>
                <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0">
                  <CustomMenu
                    isAdmin={true}
                    handleTypeChange={(value: string) => setUser({ ...user, role: value })}
                    options={userRoleOptions}
                    initialValue={user.role}
                  />
                </div>
              </div>
              <div>
                <label>Organization</label>
                <div className="flex flex-row items-center border rounded-md shadow-md lg: mb-3 md:mb-0">
                  <CustomMenu
                    isAdmin={true}
                    handleTypeChange={(value: string) => setUser({ ...user, organization: value })}
                    options={userOrganizationOptions}
                    initialValue={user.organization}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </Card>
  );
};

export default withDashboardLayout(UserMainView);
