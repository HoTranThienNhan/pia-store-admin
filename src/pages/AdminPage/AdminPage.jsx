import { Col, Menu, Row } from 'antd';
import React, { useState } from 'react';
import { getItem } from '../../utils';
import { BarChartOutlined, InboxOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import { WrapperAdminMenuSidebar } from './style';
import HomePageComponent from '../../components/Admin/HomePageComponent/HomePageComponent';
import UserManagementComponent from '../../components/Admin/UserManagementComponent/UserManagementComponent';
import ProductManagementComponent from '../../components/Admin/ProductManagementComponent/ProductManagementComponent';
import OrderManagementComponent from '../../components/Admin/OrderManagementComponent/OrderManagementComponent';
import DayStatsManagementComponent from '../../components/Admin/DayStatsManagementComponent/DayStatsManagementComponent';
import MonthStatsManagementComponent from '../../components/Admin/MonthStatsManagementComponent/MonthStatsManagementComponent';

const AdminPage = () => {
    const items = [
        getItem('Trang Chủ', 'homepage', <ShopOutlined />),
        getItem('Sản Phẩm', 'products', <ShopOutlined />),
        getItem('Người Dùng', 'users', <TeamOutlined />),
        getItem('Đơn Hàng', 'orders', <InboxOutlined />),
        getItem('Thống Kê', 'stats', <BarChartOutlined />,
            [
                getItem('Theo Ngày', 'statsByDay'),
                getItem('Theo Tháng', 'statsByMonth'),
            ]
        ),
    ];

    const [selectedKey, setSelectedKey] = useState('homepage');
    const renderPage = (key) => {
        switch (key) {
            case 'homepage': 
                return (<HomePageComponent />);
            case 'products':
                return (<ProductManagementComponent />);
            case 'users':
                return (<UserManagementComponent />);
            case 'orders':
                return (<OrderManagementComponent />);
            case 'statsByMonth':
                return (<MonthStatsManagementComponent />);
            case 'statsByDay':
                return (<DayStatsManagementComponent />);
            default:
                return (<></>);
        }
    }

    const handleOnClick = ({ key }) => {
        // selectedKey from items
        setSelectedKey(key);
    }

    return (
        <div id="container" style={{ paddingTop: '85px', minHeight: '600px', height: '100%', backgroundColor: '#d4e3fa5e' }}>
            <Row>
                <Col span={4}>
                    <WrapperAdminMenuSidebar
                        mode="inline"
                        items={items}
                        onClick={handleOnClick}
                        defaultSelectedKeys={'homepage'}
                    />
                </Col>
                <Col span={20}>
                    {renderPage(selectedKey)}
                </Col>
            </Row>
        </div>
    )
};

export default AdminPage;
