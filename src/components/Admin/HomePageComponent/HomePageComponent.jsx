import {  Image, Row, } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { WrapperProductManagement } from './style';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as OrderService from '../../../services/OrderService';
import { getDayFromMongoDB, getMonthFromMongoDB, getYearFromMongoDB } from '../../../utils';
import imageHomepage from '../../../assets/images/admin-homepage.png';


const DayStatsManagementComponent = () => {
    const user = useSelector((state) => state?.user);
    const [orders, setOrders] = useState([]);

    const today = new Date();
    const thisDay = today.getDate();
    const thisMonth = today.getMonth() + 1;
    const thisYear = today.getFullYear();

    const [selectedDay, setSelectedDate] = useState(thisDay);
    const [selectedMonth, setSelectedMonth] = useState(thisMonth);
    const [selectedYear, setSelectedYear] = useState(thisYear);
    const [thisMonthYear, setThisMonthYear] = useState(thisMonth.toString() + '/' + thisYear.toString());
    const [thisFullDate, setthisFullDate] = useState(('0' + today.getDate()).slice(-2) + '/' + thisMonth.toString() + '/' + thisYear.toString());


    const onChangeMonth = (date, dateString) => {
        setSelectedMonth(dateString.substr(0, 2));
        setSelectedYear(dateString.substr(3, 4));
        setThisMonthYear(dateString);
    }

    const onChangeDate = (date, dateString) => {
        setSelectedDate(dateString.substr(0, 2));
        setSelectedMonth(dateString.substr(3, 2));
        setSelectedYear(dateString.substr(6, 4));
        setthisFullDate(dateString);
    }


    /*** ALL ORDERS ***/
    const fetchAllOrders = async () => {
        const res = await OrderService.getNotCanceledOrdersByAdmin(user?.accessToken);
        setOrders(res?.data);
        return res?.data;
    }
    useEffect(() => {
        if (user?.id) {
            //   setIsLoading(true);
            fetchAllOrders();
            //   setIsLoading(false);
        }
    }, [user]);


    /*** REVENUE ***/
    let revenueThisDay = 0;
    let revenueLastDay = 0;
    let valueAddedRevenue = 0;
    let growRateRevenue = 0;


    orders?.map((order) => {
        if (getDayFromMongoDB(order?.updatedAt) === ('0' + selectedDay).slice(-2)
            && getMonthFromMongoDB(order?.updatedAt) === selectedMonth.toString()
            && getYearFromMongoDB(order?.updatedAt) === selectedYear.toString()) {
            revenueThisDay += order?.subtotalPrice;
        }
    });
    orders?.map((order) => {
        if (getDayFromMongoDB(order?.updatedAt) === ('0' + (selectedDay - 1)).slice(-2)
            && getMonthFromMongoDB(order?.updatedAt) === selectedMonth.toString()
            && getYearFromMongoDB(order?.updatedAt) === selectedYear.toString()) {
            revenueLastDay += order?.subtotalPrice;
        }
    });
    valueAddedRevenue = revenueThisDay - revenueLastDay;
    if (revenueLastDay !== 0) {
        growRateRevenue = (valueAddedRevenue / revenueLastDay) * 100;
    } else {
        if (revenueThisDay !== 0) {
            growRateRevenue = 100;
        } else {
            growRateRevenue = 0;
        }
    }


    /*** SALES ***/
    let salesThisDay = 0;
    let salesLastDay = 0;
    let valueAddedSales = 0;
    let growRateSales = 0;

    orders?.map((order) => {
        if (getDayFromMongoDB(order?.updatedAt) === ('0' + selectedDay).slice(-2)
            && getMonthFromMongoDB(order?.updatedAt) === selectedMonth.toString()
            && getYearFromMongoDB(order?.updatedAt) === selectedYear.toString()) {
            order?.orderItems.map((orderItem) => {
                salesThisDay += orderItem?.amount;
            });
        }
    });
    orders?.map((order) => {
        if (getDayFromMongoDB(order?.updatedAt) === ('0' + (selectedDay - 1)).slice(-2)
            && getMonthFromMongoDB(order?.updatedAt) === selectedMonth.toString()
            && getYearFromMongoDB(order?.updatedAt) === selectedYear.toString()) {
            order?.orderItems.map((orderItem) => {
                salesLastDay += orderItem?.amount;
            });
        }
    });
    valueAddedSales = salesThisDay - salesLastDay;
    if (revenueLastDay !== 0) {
        growRateSales = (valueAddedSales / salesLastDay) * 100;
    } else {
        if (salesThisDay !== 0) {
            growRateSales = 100;
        } else {
            growRateSales = 0;
        }
    }


    /*** REVENUE STATS CHART ***/
    let allRevenueData = [
        { name: 'Doanh Thu', month: '1', revenue: 0, },
        { name: 'Doanh Thu', month: '2', revenue: 0, },
        { name: 'Doanh Thu', month: '3', revenue: 0, },
        { name: 'Doanh Thu', month: '4', revenue: 0, },
        { name: 'Doanh Thu', month: '5', revenue: 0, },
        { name: 'Doanh Thu', month: '6', revenue: 0, },
        { name: 'Doanh Thu', month: '7', revenue: 0, },
        { name: 'Doanh Thu', month: '8', revenue: 0, },
        { name: 'Doanh Thu', month: '9', revenue: 0, },
        { name: 'Doanh Thu', month: '10', revenue: 0, },
        { name: 'Doanh Thu', month: '11', revenue: 0, },
        { name: 'Doanh Thu', month: '12', revenue: 0, },
    ];
    const getRevenue12Months = () => {
        orders?.map((order) => {
            if (getYearFromMongoDB(order?.updatedAt) === selectedYear.toString()) {
                const month = parseInt(getMonthFromMongoDB(order?.updatedAt));
                allRevenueData.find(allRevenueData => allRevenueData.month === month.toString()).revenue += order?.subtotalPrice;
            }
        });
        return allRevenueData;
    }
    const config = {
        data: getRevenue12Months(),
        isGroup: true,
        xField: 'month',
        yField: 'revenue',
        seriesField: 'name',
        color: ['#1ca9e6', '#f88c24'],
        marginRatio: 0.1,
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
    };


    /*** NAVIGATE ***/
    const navigate = useNavigate();
    const handleNavigateHomePage = () => {
        navigate('/');
    }


    return (
        <WrapperProductManagement>
            <div style={{ padding: '100px 0px' }}>
                <Row justify="center">
                    <h1 style={{ fontWeight: 'bold' }}>Chào Mừng Bạn Đến Admin Dashboard</h1>
                </Row>
                <Row justify="center">
                    Pia Store Admin luôn đồng hành và hỗ trợ bạn trong suốt quá trình quản lý cửa hàng.
                </Row>
                <Row justify="center">
                    <Image src={imageHomepage} preview={false} height={300} style={{ marginTop: '30px' }} />
                </Row>
            </div>
        </WrapperProductManagement>
    )
};

export default DayStatsManagementComponent;