import axios from "axios";

export const axiosJWT = axios.create();

export const createReview = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/review/createReview`, data);
    return res.data;
}

export const getReview = async (orderId, productId, userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/getReview/${orderId}&${productId}&${userId}`);
    return res.data;
}

export const getReviewByProduct = async (productId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/getReviewByProduct/${productId}`);
    return res.data;
}