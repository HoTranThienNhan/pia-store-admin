import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import React, { useState } from 'react';

const InputFormComponent = (props) => {
    const { placeholder = 'Nhập text', prefix, suffix, style, onChange, ...rests } = props;
    const handleOnChangeInput = (e) => {
        props.onChange(e);
    }
    return (
       <Input 
            placeholder={placeholder} 
            prefix={prefix}
            suffix={suffix} 
            style={style}
            value={props.value}
            onChange={handleOnChangeInput}
            {...rests}
        /> 
    )
};

export default InputFormComponent
