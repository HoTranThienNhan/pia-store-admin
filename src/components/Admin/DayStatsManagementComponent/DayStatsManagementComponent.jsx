import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    DollarOutlined,
    InboxOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Card, Col, DatePicker, Row, Tag, } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { WrapperProductManagement } from './style';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import * as OrderService from '../../../services/OrderService';
import { getDayFromMongoDB, getMonthFromMongoDB, getYearFromMongoDB } from '../../../utils';
import dayjs from 'dayjs';


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
            <div style={{ userSelect: 'none' }}>
                <h2 style={{ fontWeight: 'bold' }}>Quản Lý Thống Kê Theo Ngày</h2>
                <Breadcrumb
                    items={[
                        {
                            title: <span onClick={handleNavigateHomePage} style={{ cursor: 'pointer' }}>Trang chủ</span>,
                        },
                        {
                            title: 'Quản lý thống kê theo ngày',
                        },
                    ]}
                />
            </div>
            <div style={{ padding: '30px 0px' }}>
                <Row style={{ marginBottom: '15px' }}>
                    <Col>
                        <DatePicker
                            defaultValue={dayjs(thisFullDate, 'DD-MM-YYYY')}
                            onChange={onChangeDate}
                            allowClear={false}
                            format={'DD/MM/YYYY'}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{ marginRight: '30px' }}>
                        <Card style={{ boxShadow: '0px 0px 4px 3px #cacaca8a', borderRadius: '15px' }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '10px' }}>
                                    <span style={{ color: '#a0a0a0', fontSize: '16px', fontWeight: '600' }}>
                                        <DollarOutlined /><span style={{ marginLeft: '7px' }}>Doanh Thu Ngày {thisFullDate}</span>
                                    </span>
                                </Col>
                                <Col span={24} style={{ marginBottom: '7px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '20px' }}>
                                        <span style={{ marginRight: '7px' }}>{revenueThisDay.toLocaleString()} VNĐ</span>
                                        <Tag
                                            color={growRateRevenue > 0 ? "green" : (growRateRevenue < 0 ? "red" : "orange")}
                                        >
                                            <span style={{ marginRight: '5px' }}>
                                                {growRateRevenue > 0 ? <ArrowUpOutlined />
                                                    : (growRateRevenue < 0 ? <ArrowDownOutlined /> : <SwapOutlined />)}
                                            </span>
                                            {Math.abs(growRateRevenue.toFixed(2))}%
                                        </Tag>
                                    </span>
                                </Col>
                                <Col span={24}>
                                    <span>
                                        <span style={{
                                            color: valueAddedRevenue > 0 ? 'green' : (valueAddedRevenue < 0 ? 'red' : 'orange'),
                                            fontWeight: '600',
                                            marginRight: '5px'
                                        }}
                                        >
                                            {valueAddedRevenue >= 0 && '+'}{valueAddedRevenue.toLocaleString()} VNĐ
                                        </span>
                                        <span style={{ color: '#a0a0a0' }}>so với hôm qua</span>
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ boxShadow: '0px 0px 4px 3px #cacaca8a', borderRadius: '15px' }}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '10px' }}>
                                    <span style={{ color: '#a0a0a0', fontSize: '16px', fontWeight: '600' }}>
                                        <InboxOutlined /><span style={{ marginLeft: '7px' }}>Doanh Số Ngày {thisFullDate}</span>
                                    </span>
                                </Col>
                                <Col span={24} style={{ marginBottom: '7px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '20px' }}>
                                        <span style={{ marginRight: '7px' }}>{salesThisDay} sản phẩm</span>
                                        <Tag
                                            color={growRateSales > 0 ? "green" : (growRateSales < 0 ? "red" : "orange")}
                                        >
                                            <span style={{ marginRight: '5px' }}>
                                                {growRateSales > 0 ? <ArrowUpOutlined />
                                                    : (growRateSales < 0 ? <ArrowDownOutlined /> : <SwapOutlined />)}
                                            </span>
                                            {Math.abs(growRateSales.toFixed(2))}%
                                        </Tag>
                                    </span>
                                </Col>
                                <Col span={24}>
                                    <span>
                                        <span style={{
                                            color: valueAddedSales > 0 ? 'green' : (valueAddedSales < 0 ? 'red' : 'orange'),
                                            fontWeight: '600',
                                            marginRight: '5px'
                                        }}
                                        >
                                            {valueAddedSales >= 0 && '+'}{valueAddedSales} sản phẩm
                                        </span>
                                        <span style={{ color: '#a0a0a0' }}>so với hôm qua</span>
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row style={{ marginTop: '30px' }}>
                    <Col span={18}>
                        {/* <Card style={{ boxShadow: '0px 0px 4px 3px #cacaca8a', borderRadius: '10px' }}>
                            <Row justify="center">
                                <Col span={22} align="middle">
                                    <span style={{ fontSize: '18px', fontWeight: '600' }}>
                                        Biểu Đồ Doanh Thu Thuần Giai Đoạn Tháng 1 - Tháng 12 Năm {selectedYear}
                                    </span>
                                </Col>
                                <Col span={22} style={{ marginTop: '15px' }}>
                                    <Column
                                        {...config}
                                    />
                                </Col>
                            </Row>
                        </Card> */}
                    </Col>
                </Row>
            </div>
        </WrapperProductManagement>
    )
};

export default DayStatsManagementComponent;