import axios from "axios";

export const axiosJWT = axios.create();

export const getAllProducts = async (search, limitProducts = 20, type, onlyActive) => {
    let res = {};
    if (search?.length) {
        // get all products by search name, limit 20 products and either active or not
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProducts?filter=name&filter=${search}&limitProducts=${limitProducts}&onlyActive=${onlyActive}`);
    } else if (type?.length) {
        // get all products by type, limit 20 products and either active or not
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProducts?filter=type&filter=${type}&limitProducts=${limitProducts}&onlyActive=${onlyActive}`);
    } else {
        // get all products with limit 20 products and either active or not
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProducts?limitProducts=${limitProducts}&onlyActive=${onlyActive}`);
    }
    return res.data;
}

export const getAllProductTypes = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAllProductTypes`);
    return res.data;
}

export const createProduct = async (data, accessToken) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/createProduct`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const getActiveProductDetails = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getActiveProductDetails/${id}`);
    return res.data;
}

export const getProductDetails = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getProductDetails/${id}`);
    return res.data;
}

export const updateProduct = async (id, data, accessToken) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/updateProduct/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}

export const updateActiveMultipleProducts = async (data, accessToken) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/updateActiveMultipleProducts`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
    return res.data;
}