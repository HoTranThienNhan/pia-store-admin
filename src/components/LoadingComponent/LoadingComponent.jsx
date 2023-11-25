import { Spin } from 'antd';
import React from 'react';
import { SpinNonOpacity } from './style';

const LoadingComponent = ({ children, isLoading, delay = 200 }) => {
    return (
        <Spin spinning={isLoading} delay={delay}>
            {children}
        </Spin>
    )
};

export default LoadingComponent
