import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  loadUserSuccess,
  loadUserRequest,
  loadUserFailure,
} from "./authSlice";
import { getStoriesByUser } from "../story/storyAPI";

// Set base URL and withCredentials
axios.defaults.baseURL = "https://swiptory-backend-bse5.onrender.com";
axios.defaults.withCredentials = true;

// ===================================== LOAD USER =====================================

export const loadUser = () => async (dispatch) => {
  const username = JSON.parse(localStorage.getItem("username"));
  if (!username) {
    dispatch(loadUserFailure());
    return;
  }
  
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(`/api/user/load/${username}`);

    dispatch(loadUserSuccess(data));
  } catch (error) {
    console.error(error);
    dispatch(loadUserFailure());
    toast.error("Failed to load user data.");
  }
};

// ===================================== REGISTER ==================================

export const register = (values) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data } = await axios.post("/api/user/register", values, { withCredentials: true });

    dispatch(registerSuccess(data));
    localStorage.setItem("username", JSON.stringify(data.username));
    toast.success("Register successful!", {
      position: "bottom-left",
      autoClose: 2000,
    });
  } catch (error) {
    console.error(error);
    dispatch(registerFailure());
    if (error.response) {
      toast.error(error.response.data || "Failed to register.");
    } else {
      toast.error("Failed to register.");
    }
  }
};

// ===================================== LOGIN =====================================

export const login = (values) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post("/api/user/login", values, {
      withCredentials: true,
    });

    dispatch(loginSuccess(data));

    dispatch(getStoriesByUser(data.userId));
    localStorage.setItem("username", JSON.stringify(data.username));

    toast.success("Login successful!", {
      position: "bottom-left",
      autoClose: 2000,
    });
  } catch (error) {
    console.error(error);
    dispatch(loginFailure());
    if (error.response && error.response.data) {
      toast.error(error.response.data);
    } else {
      toast.error("Failed to log in.");
    }
  }
};

// ===================================== LOGOUT =====================================

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    await axios.post("/api/user/logout", {}, { withCredentials: true });

    dispatch(logoutSuccess());
    localStorage.removeItem("username");

    toast.success("Logout successful!", {
      position: "bottom-left",
      autoClose: 1000,
    });
  } catch (error) {
    console.error(error);
    dispatch(logoutFailure());
    if (error.response && error.response.data) {
      toast.error(error.response.data);
    } else {
      toast.error("Failed to log out.");
    }
  }
};
