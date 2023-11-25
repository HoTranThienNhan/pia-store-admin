import axios from "axios";

export const axiosJWT = axios.create();

export const signinUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, data);
    return res.data;
}

export const signinAdminUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signinAdmin`, data);
    return res.data;
}

export const signupUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, data);
    return res.data;
}

export const signoutUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/signout`);
    return res.data;
}

export const getAllUsers = async (accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAllUsers`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getUserDetails = async (id, accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getUserDetails/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const updateUser = async (id, data, accessToken) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/updateUser/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const updateActiveMultipleUsers = async (data, accessToken) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/updateActiveMultipleUsers`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refreshToken`, {
        withCredentials: true // get Cookie
    });
    return res.data;
}