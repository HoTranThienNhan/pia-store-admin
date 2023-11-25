import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import React, { useState } from 'react';
import { WrapperProductTypes } from './style';

const MenuTabsComponent = (props) => {
    const { className, children, ...rests } = props;
    return (
        <WrapperProductTypes className={className} {...rests}>{children}</WrapperProductTypes>
    )
};

export default MenuTabsComponent