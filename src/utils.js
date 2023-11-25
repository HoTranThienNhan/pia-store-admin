export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export const convertDateType = (date) => {
    try {
        // date default type as 2023-10-14T11:07:42.289Z
        // convert to 14-10-2023
        const year = date.substr(0, 4);
        const month = date.substr(5, 2);
        const day = date.substr(8, 2);
        const result = day + '-' + month + '-' + year;
        return result;
    } catch (e) {
        return null;
    }
}

export const getDayFromMongoDB = (date) => {
    try {
        // date default type as 2023-10-14T11:07:42.289Z
        // get day: 14
        const day = date.substr(8, 2);
        return day;
    } catch (e) {
        return null;
    }
}

export const getMonthFromMongoDB = (date) => {
    try {
        // date default type as 2023-10-14T11:07:42.289Z
        // get month: 10
        const month = date.substr(5, 2);
        return month;
    } catch (e) {
        return null;
    }
}

export const getYearFromMongoDB = (date) => {
    try {
        // date default type as 2023-10-14T11:07:42.289Z
        // get year: 2023
        const year = date.substr(0, 4);
        return year;
    } catch (e) {
        return null;
    }
}

export const convertOrderStatus = (status) => {
    try {
        if (status === 'pending') {
            return 'Chờ Xác Nhận';
        } else if (status === 'pickingup') {
            return 'Chờ Lấy Hàng';
        } else if (status === 'delivering') {
            return 'Đang Giao';
        } else if (status === 'delivered') {
            return 'Đã Giao';
        } else if (status === 'canceled') {
            return 'Đã Hủy';
        }
    } catch (e) {
        return '';
    }
}

export const getTotalAmountOrder = (order) => {
    let totalAmount = 0;
    order?.orderItems?.map((orderItem) => {
        totalAmount += orderItem.amount;
    });
    return totalAmount;
}

export const convertAddressString = (province, district, ward) => {
    try {
        // convert to string "ward, district, province"
        return ward + ", " + district + ", " + province;
    } catch (e) {
        return null;
    }
}