import axios from "axios";

export const axiosJWT = axios.create();

export const createOrder = async (data, accessToken) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/createOrder`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getAllOrders = async (userId, accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/getAllOrders/${userId}`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getAllOrdersByAdmin = async (accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/getAllOrdersByAdmin`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getNotCanceledOrdersByAdmin = async (accessToken) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/getNotCanceledOrdersByAdmin`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const cancelOrder = async (orderId, accessToken, order) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancelOrder/${orderId}`, {data: order}, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const updateOrderState = async (orderId, accessToken, order, status) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/updateOrderState/${orderId}&${status}`, {data: order}, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getOrderByStatus = async (userId, accessToken, status) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/getOrderByStatus/${userId}&${status}`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getOrderDetails = async (orderId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/getOrderDetails/${orderId}`);
    return res.data;
}