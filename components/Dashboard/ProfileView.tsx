"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { Row, Col, Card, Button, Input } from "antd";
import Image from "next/image";
import withDashboardLayout from "@/hoc/withDashboardLayout";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import {
  updateProfileImage,
  updateUserDetails,
} from "@/app/store/slice/authSlice";
import { PencilIcon } from "@heroicons/react/16/solid";

interface formDataType {
  firstName: string;
  lastName: string;
}

const initialPasswordState = {
  password: "",
  newPassword: "",
  confirmpassword: "",
};

const ProfileView = () => {
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [password, setPassword] = useState(initialPasswordState);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<formDataType>({
    firstName: user?.firstName,
    lastName: user?.lastName,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        "/users/update-user",
        formData
      );
      if (response.status === 200) {
        toast.success("Updated Successfully");
        dispatch(updateUserDetails(response.data));
      }
    } catch (error: any) {
      console.log("error->", error);
      toast.error("Error updating the records");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.newPassword !== password.confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordChangeLoading(true);
      const response = await axiosInstance.patch(
        "/users/update-password",
        password
      );
      if (response.status === 200) {
        toast.success("Password updated Successfully");
        setPassword(initialPasswordState);
      }
    } catch (error) {
      console.log("error->", error);
      toast.error("Error updating the Password");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleFileUpload = async (selectedImage: any) => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append("file", selectedImage);
        const response = await axiosInstance.put("/users/profile", formData);

        if (response.status === 200) {
          dispatch(updateProfileImage({ profile: response.data.profile }));
          toast.success("Avatar Updated Succesfully");
        } else {
          console.log("error->", response);
        }
      } catch (error) {
        console.log("error->>>", error);
        toast.error("Error updating the records");
      }
    }
  };

  return (
    <>
      {user && (
        <>
          <h1 className=" text-3xl font-semibold text-black">Profile</h1>
          <Row gutter={[24, 0]}>
            <Col span={24} md={10} lg={9} xl={8} className="mb-24">
              <Card
                bordered={false}
                className="header-solid flex flex-col justify-center items-center relative"
              >
                <div className="flex justify-end w-full">
                  <label
                    className=" "
                    onChange={(e: any) => handleFileUpload(e.target.files[0])}
                    htmlFor="mobileImageUpload"
                  >
                    <input
                      name=""
                      type="file"
                      accept="image/*"
                      id="mobileImageUpload"
                      hidden
                    />
                    <PencilIcon
                      width={25}
                      className=" absolute top-5 right-5 mb-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                    />
                  </label>
                </div>
                <div className="mt-8 relative w-64 h-64 md:w-48 md:h-48 xl:w-64 xl:h-64 rounded-full overflow-hidden">
                  <Image
                    src={user.profile || "/dummyAvatar.png"}
                    alt="User avatar"
                    className="w-full h-full object-cover rounded-full"
                    unoptimized
                    width={100}
                    height={100}
                  />
                </div>
              </Card>
            </Col>

            <Col span={24} md={14} lg={15} className="mb-24">
              <Card bordered={false} className="header-solid h-full ">
                <div className=" flex justify-between mb-3">
                  <h6 className="font-semibold my-5">Profile Information</h6>
                </div>

                <div>
                  <div className=" grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="firstName"
                        className=" w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="First Name"
                        className="w-full !text-gray-600"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="lastName"
                        className="w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Last Name"
                        className="w-full !text-gray-800"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="email"
                        className="w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="email address"
                        className="w-full"
                        value={user.email}
                        disabled
                      />
                    </div>
                    <div className=" flex flex-row justify-end gap-3 md:col-span-2">
                      <Button
                        className=" w-24"
                        onClick={handleSave}
                        loading={loading}
                        type="primary"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <hr className="my-5" />

                  <div className=" flex justify-between mb-3">
                    <h6 className="font-semibold my-5">Change Password</h6>
                  </div>
                  <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="password"
                        className="w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        Old Password
                      </label>
                      <Input
                        id="password"
                        placeholder="Old Password"
                        className="w-full !text-gray-800"
                        value={password.password}
                        onChange={(e) =>
                          setPassword({ ...password, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="newPassword"
                        className="w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        placeholder="New Password"
                        className="w-full !text-gray-800"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full gap-2 ">
                      <label
                        htmlFor="newPassword"
                        className="w-28 whitespace-nowrap text-gray-800 font-semibold"
                      >
                        Confirm Password
                      </label>
                      <Input
                        id="newPassword"
                        placeholder="Confirm Password"
                        className="w-full !text-gray-800"
                        value={password.confirmpassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            confirmpassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className=" flex justify-end gap-4 md:col-span-3">
                      <Button
                        className=" w-24"
                        onClick={handlePasswordChange}
                        type="primary"
                        loading={passwordChangeLoading}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default withDashboardLayout(ProfileView);
