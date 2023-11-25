import { Button, Divider, Popconfirm, Radio, Table } from 'antd';
import React, { useRef, useState } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { FileExcelOutlined } from '@ant-design/icons';
import { ButtonExportToExcel, WrapperTable } from './style';

const TableComponent = (props) => {
    const {
        selectionType = 'checkbox',
        data = [],
        columns = [],
        isLoading = false,
        excelFileName = 'DefaultTable',
        handleActiveMultipleConfirm
    } = props;

    const [selectedMultipleRowKeys, setSelectedMultipleRowKeys] = useState([]);

    const tableRef = useRef(null);
    const excelSheetName = excelFileName.replace('Table', '');

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedMultipleRowKeys(selectedRowKeys);
        },
    };

    const handleActiveUpdateMultiple = () => {
        handleActiveMultipleConfirm(selectedMultipleRowKeys, true);
    }

    const handleInactiveUpdateMultiple = () => {
        handleActiveMultipleConfirm(selectedMultipleRowKeys, false);
    }

    const handleInactiveUpdateCancel = () => { }

    const handleActiveUpdateCancel = () => { }

    console.log(tableRef);

    return (
        <WrapperTable>
            {selectedMultipleRowKeys.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận tắt hoạt động"
                        description={<span>Bạn chắc chắn muốn thực hiện<br /> thao tác này?</span>}
                        onConfirm={handleInactiveUpdateMultiple}
                        onCancel={handleInactiveUpdateCancel}
                        okText="Chắc chắn"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                            style={{ marginRight: '15px' }}
                            danger
                        >
                            Tắt Hoạt Động
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận bật hoạt động"
                        description={<span>Bạn chắc chắn muốn thực hiện<br /> thao tác này?</span>}
                        onConfirm={handleActiveUpdateMultiple}
                        onCancel={handleActiveUpdateCancel}
                        okText="Chắc chắn"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                        >
                            Bật Hoạt Động
                        </Button>
                    </Popconfirm>
                </div>
            )}

            {/* Export Table To Excel */}
            {/* <DownloadTableExcel
                filename={excelFileName}
                sheet={excelSheetName}
                currentTableRef={tableRef.current}
            >
                <ButtonExportToExcel type="dashed">
                    <FileExcelOutlined /> Xuất sang Excel
                </ButtonExportToExcel>
            </DownloadTableExcel> */}

            <LoadingComponent isLoading={isLoading}>
                <Table
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    ref={tableRef}
                    {...props}
                />
            </LoadingComponent>
        </WrapperTable>
    )
};

export default TableComponent;
