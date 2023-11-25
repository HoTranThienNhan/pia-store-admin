import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import React from 'react';

const SearchButtonComponent = (props) => {
    const { placeholder, width } = props;
    return (
        <Space.Compact style={{ width: '100%' }}>
            <Input
                placeholder={placeholder}
                style={{
                    width: width,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid lightgray',
                    borderTop: '1px solid lightgray',
                    borderLeft: '1px solid lightgray',
                    borderTopLeftRadius: '13px',
                    borderBottomLeftRadius: '13px',
                    borderRight: 'none'
                }}
                allowClear
                bordered={false}
                {...props}
            />
            <Button
                icon={<SearchOutlined />}
                style={{
                    color: 'black',
                    borderTopRightRadius: '13px',
                    borderBottomRightRadius: '13px',
                    borderBottom: '1px solid lightgray',
                    borderTop: '1px solid lightgray',
                    borderRight: '1px solid lightgray',
                    borderLeft: 'none',
                }}
            >
            </Button>
        </Space.Compact>
    )
};

export default SearchButtonComponent
