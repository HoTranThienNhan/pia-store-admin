import axios from "axios";

export const axiosJWT = axios.create();

export const getProvinces = async () => {
    const res = await axios.get(`https://provinces.open-api.vn/api/p/?depth=1`);
    return res.data;
}

export const getDistricts = async (provinceCode) => {
    const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    return res.data.districts;
}

export const getWards = async (districtCode) => {
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    return res.data.wards;
}

