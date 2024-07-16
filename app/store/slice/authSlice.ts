import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";

type AuthState = {
  isAuthenticated: boolean;
  user: any;
  token: string;
  isAdmin: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: "",
  isAdmin: false,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      const { token, user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.isAdmin = user.role === 'Admin'

      localStorage.setItem("nhs_token", token);
      axiosInstance.defaults.headers.Authorization = "Bearer " + token;
      Cookies.set("nhs_token", token, { expires: 7 });
    },
    logout(state) {
      Cookies.remove("nhs_token");
      localStorage.removeItem("nhs_token");
      sessionStorage.setItem("didLogout", "true");

      if (axiosInstance.defaults.headers) {
        axiosInstance.defaults.headers.Authorization = "";
      }

      state.isAuthenticated = false;
      state.user = null;
      state.token = "";
    },
    updateUserDetails(state, action: PayloadAction<any>) {
      const { user } = action.payload;
      state.user = user;
    },
    updateProfileImage: (state, action) => {
      const { profile } = action.payload;
      state.user.profile = profile;
    },
  },
});

export const { login, logout, updateUserDetails, updateProfileImage } =
  authSlice.actions;
export default authSlice.reducer;
