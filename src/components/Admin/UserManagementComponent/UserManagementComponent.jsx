import {
    DeleteOutlined,
    FormOutlined,
    HomeOutlined,
    IdcardOutlined,
    LockOutlined,
    PhoneOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Col, Form, Modal, Popconfirm, Row, Space, Switch, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import TableComponent from '../../TableComponent/TableComponent';
import { WrapperProductManagement, WrapperUploadProductImage } from './style';
import FloatingLabelComponent from '../../FloatingLabelComponent/FloatingLabelComponent';
import InputFormComponent from '../../InputFormComponent/InputFormComponent';
import { convertDateType, getBase64 } from '../../../utils';
import * as UserService from '../../../services/UserService';
import { useMutationHooks } from '../../../hooks/useMutationHook';
import LoadingComponent from '../../LoadingComponent/LoadingComponent';
import * as MessagePopup from '../../../components/MessagePopupComponent/MessagePopupComponent';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const UserManagementComponent = () => {
    /*** USE STATE ***/
    const user = useSelector((state) => state?.user);

    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);

    // loading update and active user when waiting for getting all users
    const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);
    const [isLoadingActiveUser, setIsLoadingActiveUser] = useState(false);

    const [userState, setUserState] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
        password: '',
        confirmPassword: '',
        active: true,
        isAdmin: false,
    });
    const [updateUserState, setUpdateUserState] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
        active: true,
        isAdmin: false,
    });
    const [activeUserState, setActiveUserState] = useState({
        active: true
    });
    const [adminUserState, setAdminUserState] = useState({
        isAdmin: true
    });

    const [selectedRow, setSelectedRow] = useState('');
    const [selectedActiveRow, setSelectedActiveRow] = useState('');
    const [selectedAdminRow, setSelectedAdminRow] = useState('');

    // const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    /*** RENDER TABLE ***/
    const renderTableUpdate = () => {
        return (
            <div>
                <FormOutlined className='all-users-update' style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleUpdateUserDetails} />
            </div>
        );
    }

    const renderTableAdmin = (isAdmin, allUser) => {
        const { userData } = allUser;
        const description = isAdmin === true ? "người dùng thường" : "người dùng admin";
        return (
            <div>
                <Form>
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận bật/tắt tài khoản admin"
                        description={
                            <span>Lưu ý! Bạn chắc chắn muốn chuyển<br />
                                tài khoản <b>{userData.fullname}</b> sang<b> {description}</b> ?</span>
                        }
                        onConfirm={handleAdminUserConfirm}
                        onCancel={handleAdminUserCancel}
                        okText="Chắc chắn"
                        cancelText="Không"
                    >
                        <Checkbox
                            className='all-users-admin'
                            checked={isAdmin}
                            onChange={handleOnChangeAdminUserState}
                            disabled={user.id === userData._id}     // disable checkbox admin for current user
                        >
                        </Checkbox>
                    </Popconfirm>
                </Form>
            </div>
        );
    }

    const renderTableActive = (isActive) => {
        return (
            <div>
                <Form>
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận bật/tắt người dùng"
                        description={<span>Bạn chắc chắn muốn thực hiện<br /> thao tác này?</span>}
                        onConfirm={handleActiveUserConfirm}
                        onCancel={handleActiveUserCancel}
                        okText="Chắc chắn"
                        cancelText="Không"
                    >
                        <Switch
                            className='all-users-active'
                            checked={isActive}
                            loading={isLoadingActiveUser}
                            onChange={handleOnChangeActiveUserState}
                        />
                    </Popconfirm>
                </Form>
            </div>
        );
    }


    /*** GET ALL PRODUCTS ***/
    const getAllUsers = async () => {
        const res = await UserService.getAllUsers();
        return res;
    }
    const queryAllUsers = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers
    });
    const { isLoading: isLoadingAllUsers, data: allUsers } = queryAllUsers;


    /*** SEARCH ***/
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputFormComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });


    /** COLUMNS TABLE AND TABLE DATA ***/
    const columnsUsers = [
        {
            title: 'Tên Người Dùng',
            dataIndex: 'fullname',
            className: 'all-products-name',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'all-products-price',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            className: 'all-products-type',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            render: (data) => <span>{convertDateType(data)}</span>,
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            className: 'all-products-type',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            render: (isAdmin, userData) => {
                return renderTableAdmin(isAdmin, { userData });
            },
            filters: [
                {
                    text: 'Tất Cả',
                    value: 'all',
                },
                {
                    text: 'Tài Khoản Admin',
                    value: 'isAdmin',
                },
                {
                    text: 'Tài Khoản Thường',
                    value: 'isNotAdmin',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                if (value === 'all') {
                    return record.isAdmin === true || record.isAdmin === false;
                } else if (value === 'isAdmin') {
                    return record.isAdmin === true;

                } else if (value === 'isNotAdmin') {
                    return record.isAdmin === false;
                }
            },
        },
        {
            title: 'Cập Nhật',
            dataIndex: 'update',
            render: renderTableUpdate,
        },
        {
            title: 'Hoạt Động',
            dataIndex: 'active',
            render: (isActive) => {
                return renderTableActive(isActive);
            },
            filters: [
                {
                    text: 'Tất Cả',
                    value: 'all',
                },
                {
                    text: 'Hiện',
                    value: 'show',
                },
                {
                    text: 'Ẩn',
                    value: 'hide',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                if (value === 'all') {
                    return record.active === true || record.active === false;
                } else if (value === 'show') {
                    return record.active === true;

                } else if (value === 'hide') {
                    return record.active === false;
                }
            },
        }
    ];
    // set unique data-row-key for each row of table
    const dataUsersTable = allUsers?.data?.length && allUsers?.data?.map((user) => {
        return {
            ...user,
            key: user.email
        }
    });


    /*** CREATE PRODUCT ***/
    // mutation
    const mutation = useMutationHooks(
        (data) => {
            const {
                fullname,
                email,
                phone,
                address,
                avatar,
                password,
                confirmPassword,
                active,
                isAdmin,
            } = data;
            const res = UserService.signupUser({
                fullname,
                email,
                phone,
                address,
                avatar,
                password,
                confirmPassword,
                active,
                isAdmin,
            });
            return res;
        }
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    // use effect
    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            MessagePopup.success();
            handleCreateUserCancel();
        } else if (data?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccess, isError]);

    // handle create product modals
    const showCreateUserModal = () => {
        setIsCreateUserModalOpen(true);
    };
    const onCreateUserFinish = () => {
        mutation.mutate(
            userState,
            {
                onSettled: () => {
                    queryAllUsers.refetch();
                }
            }
        );
    }
    const handleCreateUserOk = () => {
        onCreateUserFinish();
    };
    const handleCreateUserCancel = () => {
        setIsCreateUserModalOpen(false);
        setUserState({
            fullname: '',
            email: '',
            phone: '',
            address: '',
            avatar: '',
            password: '',
            confirmPassword: '',
            active: true,
            isAdmin: false,
        });
    };
    const handleCreateUserOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setUserState({
            ...userState,
            avatar: file.preview
        });
    }
    const handleCreateUserRemoveAvatar = () => {
        setUserState({
            ...userState,
            avatar: ''
        });
    }
    const handleOnChangeUserState = (e) => {
        setUserState({
            ...userState,
            [e.target.name]: e.target.value
        });
    }


    /*** UPDATE PRODUCT ***/
    // mutation update product
    const mutationUpdateUser = useMutationHooks(
        ({ id, accessToken, updatedData } = data) =>
            UserService.updateUser(id, updatedData, accessToken)
    );
    const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdateUser;

    // use effect selected row on table
    useEffect(() => {
        if (selectedRow) {
            getUpdateUserDetails(selectedRow);
        }
    }, [selectedRow]);

    // use effect
    useEffect(() => {
        if (isSuccessUpdate && dataUpdate?.status === "OK") {
            MessagePopup.success();
            handleUpdateUserCancel();
            getAllUsers();
        } else if (dataUpdate?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccessUpdate, isErrorUpdate]);

    // get update user details and fill into the update user modal
    const getUpdateUserDetails = async (id) => {
        const res = await UserService.getUserDetails(id);
        if (res?.data) {
            setUpdateUserState({
                fullname: res?.data?.fullname,
                email: res?.data?.email,
                phone: res?.data?.phone,
                address: res?.data?.address,
                avatar: res?.data?.avatar,
            });
        }
        setIsLoadingUpdateUser(false);
    }
    const handleUpdateUserDetails = () => {
        setIsLoadingUpdateUser(true);
        if (selectedRow) {
            getUpdateUserDetails(selectedRow);
        }
        showUpdateUserModal();
    }

    // handle update product modals
    const showUpdateUserModal = () => {
        setIsUpdateUserModalOpen(true);
    };
    const handleUpdateUserCancel = () => {
        setIsUpdateUserModalOpen(false);
        setSelectedRow(null);
        setUpdateUserState({
            fullname: '',
            email: '',
            phone: '',
            address: '',
            avatar: '',
            active: true,
            isAdmin: false,
        });
    };
    const handleUpdateUserRemoveAvatar = () => {
        setUpdateUserState({
            ...updateUserState,
            avatar: ''
        });
    }
    const handleUpdateUserOnChangeImage = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setUpdateUserState({
            ...updateUserState,
            avatar: file.preview
        });
    }
    const handleOnChangeUpdateUserState = (e) => {
        setUpdateUserState({
            ...updateUserState,
            [e.target.name]: e.target.value
        });
    }
    const onUpdateUserFinish = () => {
        mutationUpdateUser.mutate(
            {
                id: selectedRow,
                accessToken: user?.accessToken,
                updatedData: updateUserState
            },
            {
                onSettled: () => {
                    queryAllUsers.refetch();
                }
            }
        );
    }
    const handleUpdateUserOk = () => {
        onUpdateUserFinish();
    };


    /*** ADMIN USER ***/
    // mutation 
    const mutationAdminUser = useMutationHooks(
        ({ id, accessToken, updatedData } = data) =>
            UserService.updateUser(id, updatedData, accessToken)
    );
    const { data: dataAdmin, isLoading: isLoadingAdmin, isSuccess: isSuccessAdmin, isError: isErrorAdmin } = mutationAdminUser;

    // use effect selected row on table
    useEffect(() => {
        if (selectedAdminRow) {
            getUpdateUserDetails(selectedAdminRow);
        }
    }, [selectedAdminRow]);

    // use effect
    useEffect(() => {
        if (isSuccessAdmin && dataAdmin?.status === "OK") {
            MessagePopup.success();
            getAllUsers();
        } else if (dataAdmin?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccessAdmin, isErrorAdmin]);

    // handle admin user checkboxes, value.target.checked contains the current checkbox's status,
    // set state for checkbox's status when clicking with not "!" operator.
    const handleOnChangeAdminUserState = (value) => {
        // setIsLoadingAdminUser(true);
        setAdminUserState({
            ...adminUserState,
            ['isAdmin']: !value.target.checked
        });
    }
    const handleAdminUserConfirm = () => {
        mutationAdminUser.mutate(
            {
                id: selectedAdminRow,
                accessToken: user?.accessToken,
                updatedData: adminUserState
            },
            {
                onSettled: () => {
                    queryAllUsers.refetch();
                }
            }
        );
        // setIsLoadingAdminUser(false);
    }
    const handleAdminUserCancel = () => {
        // setIsLoadingAdminUser(false);
    }


    /*** ACTIVE USER ***/
    // mutation 
    const mutationActiveUser = useMutationHooks(
        ({ id, accessToken, updatedData } = data) =>
            UserService.updateUser(id, updatedData, accessToken)
    );
    const { data: dataActive, isLoading: isLoadingActive, isSuccess: isSuccessActive, isError: isErrorActive } = mutationActiveUser;

    // use effect selected row on table
    useEffect(() => {
        if (selectedActiveRow) {
            getUpdateUserDetails(selectedActiveRow);
        }
    }, [selectedActiveRow]);

    // use effect
    useEffect(() => {
        if (isSuccessActive && dataActive?.status === "OK") {
            MessagePopup.success();
            getAllUsers();
        } else if (dataActive?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccessActive, isErrorActive]);

    // handle active product switches, value contains the switch's status after onChange,
    // set state for switch's status when clicking with the value.
    const handleOnChangeActiveUserState = (value) => {
        // setIsLoadingActiveUser(true);
        setActiveUserState({
            ...activeUserState,
            ['active']: value
        });
    }
    const handleActiveUserConfirm = () => {
        mutationActiveUser.mutate(
            {
                id: selectedActiveRow,
                accessToken: user?.accessToken,
                updatedData: activeUserState
            },
            {
                onSettled: () => {
                    queryAllUsers.refetch();
                }
            }
        );
        // setIsLoadingActiveUser(false);
    }
    const handleActiveUserCancel = () => {
        // setIsLoadingActiveUser(false);
    }

    /*** ACTIVE MULTIPLE PRODUCTS ***/
    // mutation 
    const mutationActiveMultipleUsers = useMutationHooks(
        ({ data, accessToken } = data) =>
            UserService.updateActiveMultipleUsers(data, accessToken)
    );
    // const { data: dataActive, isLoading: isLoadingActive, isSuccess: isSuccessActive, isError: isErrorActive } = mutationActiveMultipleUsers;
    const handleActiveMultipleUsersConfirm = (userEmails, isActive) => {
        mutationActiveMultipleUsers.mutate(
            {
                data: { userEmails, isActive },
                accessToken: user?.accessToken
            },
            {
                onSettled: () => {
                    queryAllUsers.refetch();
                }
            }
        );
        // setIsLoadingActiveProduct(false);
    }

    /*** NAVIGATE ***/
    const navigate = useNavigate();
    const handleNavigateHomePage = () => {
        navigate('/');
    }


    return (
        <WrapperProductManagement>
            <div style={{ userSelect: 'none' }}>
                <h2 style={{ fontWeight: 'bold' }}>Quản Lý Người Dùng</h2>
                <Breadcrumb
                    items={[
                        {
                            title: <span onClick={handleNavigateHomePage} style={{ cursor: 'pointer' }}>Trang chủ</span>,
                        },
                        {
                            title: 'Quản lý người dùng',
                        },
                    ]}
                />
            </div>
            <div style={{ padding: '30px 0px' }}>
                <div className='add-new-product'>
                    <Button className='add-new-product-button' onClick={showCreateUserModal} >
                        <PlusOutlined />
                    </Button>
                    {/* Modal Create New User */}
                    <Modal
                        title="Thêm Người Dùng"
                        open={isCreateUserModalOpen}
                        maskClosable={false}
                        width="550px"
                        closeIcon={null}
                        footer={[
                            <Popconfirm
                                placement='topRight'
                                title="Xác nhận hủy"
                                description="Bạn chắc chắn muốn hủy thao tác?"
                                onConfirm={handleCreateUserCancel}
                                okText="Chắc chắn"
                                cancelText="Không"
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                            >
                                <Button key="back">
                                    Hủy
                                </Button>
                            </Popconfirm>,
                            <Popconfirm
                                placement='topLeft'
                                title="Xác nhận thêm người dùng"
                                description="Bạn chắc chắn muốn thêm người dùng này?"
                                onConfirm={handleCreateUserOk}
                                okText="Chắc chắn"
                                cancelText="Không"
                            >
                                <Button key="submit" type="primary">
                                    Thêm
                                </Button>
                            </Popconfirm>,
                        ]}>
                        <LoadingComponent isLoading={isLoading}>
                            <Form autoComplete="off">
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='auth-form-item-product-id'
                                >
                                    <FloatingLabelComponent
                                        label="Họ tên"
                                        value={userState.fullname}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            name="fullname"
                                            placeholder=""
                                            prefix={<IdcardOutlined className="site-form-item-icon" />}
                                            className='auth-input-product-id'
                                            value={userState.fullname}
                                            onChange={handleOnChangeUserState}
                                            style={{
                                                borderRadius: '10px',
                                                padding: '0px 18px',
                                                marginTop: '20px',
                                                border: '1px solid #000',
                                                height: '45px'
                                            }}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='auth-form-item-product-name'
                                >
                                    <FloatingLabelComponent
                                        label="Tài khoản email"
                                        value={userState.email}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            name="email"
                                            placeholder=""
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            className='auth-input-product-name'
                                            value={userState.email}
                                            onChange={handleOnChangeUserState}
                                            style={{
                                                borderRadius: '10px',
                                                padding: '0px 18px',
                                                marginTop: '20px',
                                                border: '1px solid #000',
                                                height: '45px'
                                            }}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='auth-form-item-product-type'
                                >
                                    <FloatingLabelComponent
                                        label="Số điện thoại"
                                        value={userState.phone}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            name="phone"
                                            placeholder=""
                                            prefix={<PhoneOutlined className="site-form-item-icon" />}
                                            className='auth-input-product-type'
                                            value={userState.phone}
                                            onChange={handleOnChangeUserState}
                                            style={{
                                                borderRadius: '10px',
                                                padding: '0px 18px',
                                                marginTop: '20px',
                                                border: '1px solid #000',
                                                height: '45px'
                                            }}
                                        />
                                    </FloatingLabelComponent>
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px' }}
                                        className='auth-form-item-product-count-in-stock'
                                    >
                                        <FloatingLabelComponent
                                            label="Địa chỉ"
                                            value={userState.address}
                                            styleBefore={{ left: '37px', top: '31px' }}
                                            styleAfter={{ left: '37px', top: '23px' }}
                                        >
                                            <InputFormComponent
                                                name="address"
                                                placeholder=""
                                                prefix={<HomeOutlined className="site-form-item-icon" />}
                                                className='auth-input-product-count-in-stock'
                                                value={userState.address}
                                                onChange={handleOnChangeUserState}
                                                style={{
                                                    borderRadius: '10px',
                                                    padding: '0px 18px',
                                                    marginTop: '20px',
                                                    border: '1px solid #000',
                                                    height: '45px'
                                                }}
                                            />
                                        </FloatingLabelComponent>
                                    </Form.Item>
                                </Form.Item>
                                <Row justify="space-between">
                                    <Col span={11}>
                                        <Form.Item
                                            label=""
                                            validateStatus={"validating"}
                                            help=""
                                            style={{ marginBottom: '0px' }}
                                            className='auth-form-item-product-count-in-stock'
                                        >
                                            <FloatingLabelComponent
                                                label="Mật khẩu"
                                                value={userState.password}
                                                styleBefore={{ left: '37px', top: '31px' }}
                                                styleAfter={{ left: '37px', top: '23px' }}
                                            >
                                                <InputFormComponent
                                                    name="password"
                                                    placeholder=""
                                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                                    className='auth-input-product-count-in-stock'
                                                    value={userState.password}
                                                    onChange={handleOnChangeUserState}
                                                    style={{
                                                        borderRadius: '10px',
                                                        padding: '0px 18px',
                                                        marginTop: '20px',
                                                        border: '1px solid #000',
                                                        height: '45px'
                                                    }}
                                                />
                                            </FloatingLabelComponent>
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item
                                            label=""
                                            validateStatus={"validating"}
                                            help=""
                                            style={{ marginBottom: '0px' }}
                                            className='auth-form-item-product-count-in-stock'
                                        >
                                            <FloatingLabelComponent
                                                label="Nhập lại mật khẩu"
                                                value={userState.confirmPassword}
                                                styleBefore={{ left: '37px', top: '31px' }}
                                                styleAfter={{ left: '37px', top: '23px' }}
                                            >
                                                <InputFormComponent
                                                    name="confirmPassword"
                                                    placeholder=""
                                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                                    className='auth-input-product-count-in-stock'
                                                    value={userState.confirmPassword}
                                                    onChange={handleOnChangeUserState}
                                                    style={{
                                                        borderRadius: '10px',
                                                        padding: '0px 18px',
                                                        marginTop: '20px',
                                                        border: '1px solid #000',
                                                        height: '45px'
                                                    }}
                                                />
                                            </FloatingLabelComponent>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-avatar'
                                >
                                    <WrapperUploadProductImage>
                                        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>Ảnh đại diện</div>
                                        <div style={{ display: 'grid' }}>
                                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                {userState.avatar &&
                                                    (<img className='uploaded-product-image' src={userState.avatar} alt='product' />)}
                                            </div>
                                            <div>
                                                <Upload onChange={handleCreateUserOnChangeAvatar} maxCount={1}>
                                                    <Button className='product-image-upload-button' icon={<UploadOutlined />} type='primary' ghost>
                                                        Upload
                                                    </Button>
                                                </Upload>
                                                {userState.avatar &&
                                                    <Button
                                                        className='product-image-remove-button'
                                                        icon={<DeleteOutlined />}
                                                        onClick={handleCreateUserRemoveAvatar}
                                                        danger
                                                    >
                                                        Remove
                                                    </Button>}
                                            </div>
                                        </div>
                                    </WrapperUploadProductImage>
                                </Form.Item>
                            </Form>
                        </LoadingComponent>
                    </Modal>
                </div>
                <div>
                    {/* Modal Update User */}
                    <Modal
                        title="Cập Nhật Người Dùng"
                        open={isUpdateUserModalOpen}
                        maskClosable={false}
                        width="550px"
                        closeIcon={null}
                        footer={[
                            <Popconfirm
                                placement='topRight'
                                title="Xác nhận hủy"
                                description="Bạn chắc chắn muốn hủy thao tác?"
                                onConfirm={handleUpdateUserCancel}
                                okText="Chắc chắn"
                                cancelText="Không"
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                            >
                                <Button key="back">
                                    Hủy
                                </Button>
                            </Popconfirm>,
                            <Popconfirm
                                placement='topLeft'
                                title="Xác nhận cập nhật người dùng"
                                description="Bạn chắc chắn muốn cập nhật người dùng này?"
                                onConfirm={handleUpdateUserOk}
                                okText="Chắc chắn"
                                cancelText="Không"
                            >
                                <Button key="submit" type="primary">
                                    Cập Nhật
                                </Button>
                            </Popconfirm>,
                        ]}>
                        <LoadingComponent isLoading={isLoadingUpdate}>
                            <LoadingComponent isLoading={isLoadingUpdateUser}>
                                <Form autoComplete="off">
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px' }}
                                        className='auth-form-item-product-id'
                                    >
                                        <FloatingLabelComponent
                                            label="Họ tên"
                                            value={updateUserState.fullname}
                                            styleBefore={{ left: '37px', top: '31px' }}
                                            styleAfter={{ left: '37px', top: '23px' }}
                                        >
                                            <InputFormComponent
                                                name="fullname"
                                                placeholder=""
                                                prefix={<IdcardOutlined className="site-form-item-icon" />}
                                                className='auth-input-product-id'
                                                value={updateUserState.fullname}
                                                onChange={handleOnChangeUpdateUserState}
                                                style={{
                                                    borderRadius: '10px',
                                                    padding: '0px 18px',
                                                    marginTop: '20px',
                                                    border: '1px solid #000',
                                                    height: '45px'
                                                }}
                                            />
                                        </FloatingLabelComponent>
                                    </Form.Item>
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px' }}
                                        className='auth-form-item-product-name'
                                    >
                                        <FloatingLabelComponent
                                            label="Tài khoản email"
                                            value={updateUserState.email}
                                            styleBefore={{ left: '37px', top: '31px' }}
                                            styleAfter={{ left: '37px', top: '23px' }}
                                        >
                                            <InputFormComponent
                                                name="email"
                                                placeholder=""
                                                prefix={<UserOutlined className="site-form-item-icon" />}
                                                className='auth-input-product-name'
                                                value={updateUserState.email}
                                                onChange={handleOnChangeUpdateUserState}
                                                style={{
                                                    borderRadius: '10px',
                                                    padding: '0px 18px',
                                                    marginTop: '20px',
                                                    border: '1px solid #000',
                                                    height: '45px'
                                                }}
                                            />
                                        </FloatingLabelComponent>
                                    </Form.Item>
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px' }}
                                        className='auth-form-item-product-type'
                                    >
                                        <FloatingLabelComponent
                                            label="Số điện thoại"
                                            value={updateUserState.phone}
                                            styleBefore={{ left: '37px', top: '31px' }}
                                            styleAfter={{ left: '37px', top: '23px' }}
                                        >
                                            <InputFormComponent
                                                name="phone"
                                                placeholder=""
                                                prefix={<PhoneOutlined className="site-form-item-icon" />}
                                                className='auth-input-product-type'
                                                value={updateUserState.phone}
                                                onChange={handleOnChangeUpdateUserState}
                                                style={{
                                                    borderRadius: '10px',
                                                    padding: '0px 18px',
                                                    marginTop: '20px',
                                                    border: '1px solid #000',
                                                    height: '45px'
                                                }}
                                            />
                                        </FloatingLabelComponent>
                                    </Form.Item>
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px' }}
                                        className='auth-form-item-product-count-in-stock'
                                    >
                                        <FloatingLabelComponent
                                            label="Địa chỉ"
                                            value={updateUserState.address}
                                            styleBefore={{ left: '37px', top: '31px' }}
                                            styleAfter={{ left: '37px', top: '23px' }}
                                        >
                                            <InputFormComponent
                                                name="address"
                                                placeholder=""
                                                prefix={<HomeOutlined className="site-form-item-icon" />}
                                                className='auth-input-product-count-in-stock'
                                                value={updateUserState.address}
                                                onChange={handleOnChangeUpdateUserState}
                                                style={{
                                                    borderRadius: '10px',
                                                    padding: '0px 18px',
                                                    marginTop: '20px',
                                                    border: '1px solid #000',
                                                    height: '45px'
                                                }}
                                            />
                                        </FloatingLabelComponent>
                                    </Form.Item>
                                    <Form.Item
                                        label=""
                                        validateStatus={"validating"}
                                        help=""
                                        style={{ marginBottom: '0px', width: '450px' }}
                                        className='edit-form-item-avatar'
                                    >
                                        <WrapperUploadProductImage>
                                            <div style={{ marginTop: '20px', fontWeight: 'bold' }}>Ảnh đại diện</div>
                                            <div style={{ display: 'grid' }}>
                                                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                    {updateUserState.avatar &&
                                                        (<img className='uploaded-product-image' src={updateUserState.avatar} alt='user' />)}
                                                </div>
                                                <div>
                                                    <Upload onChange={handleUpdateUserOnChangeImage} maxCount={1}>
                                                        <Button className='product-image-upload-button' icon={<UploadOutlined />} type='primary' ghost>
                                                            Upload
                                                        </Button>
                                                    </Upload>
                                                    {updateUserState.avatar &&
                                                        <Button
                                                            className='product-image-remove-button'
                                                            icon={<DeleteOutlined />}
                                                            onClick={handleUpdateUserRemoveAvatar}
                                                            danger
                                                        >
                                                            Remove
                                                        </Button>}
                                                </div>
                                            </div>
                                        </WrapperUploadProductImage>
                                    </Form.Item>
                                </Form>
                            </LoadingComponent>
                        </LoadingComponent>
                    </Modal>
                </div>

                <div className='all-products all-products-area'>
                    <div className='all-products-header'>
                        <span className='all-products-title'>Tất Cả Người Dùng</span>
                        <span style={{ userSelect: 'none', color: '#7b7b7b' }}>|</span>
                        <span className='all-products-quantity'>
                            {dataUsersTable ? dataUsersTable?.length : 0}
                        </span>
                    </div>
                    <TableComponent
                        handleActiveMultipleConfirm={handleActiveMultipleUsersConfirm}
                        columns={columnsUsers}
                        data={dataUsersTable}
                        isLoading={isLoadingAllUsers}
                        excelFileName="UsersTable"
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    // - event.target.parentElement.className 
                                    // contains class name of parent of the svg (ant-design icon which is rendered in dataUsersTable)
                                    // - only pressing the update button on every row can set setSelectedRow
                                    if (event.target.tagName === 'svg') {   // if click on svg tag (children of class 'all-users-update')
                                        if (event.target.parentElement.className.includes("all-users-update")) {
                                            setSelectedRow(record?._id)
                                        }
                                    } else if (event.target.tagName === 'path') {   // if click on path tag (children of svg tag)
                                        if (event.target.parentElement.parentElement.className.includes("all-users-update")) {
                                            setSelectedRow(record?._id)
                                        }
                                    }
                                    // - same with setSelectedActiveRow
                                    // if click on switch span (children of class 'all-users-active')
                                    else if (event.target.parentElement.className.includes("all-users-active")) {
                                        setSelectedActiveRow(record?._id)
                                    }
                                    // - same with setSelectedAdminRow
                                    // if click on input checkbox (children of a span which is a child of class 'all-users-admin')
                                    else if (event.target.parentElement.parentElement.className.includes("all-users-admin")) {
                                        setSelectedAdminRow(record?._id)
                                    }
                                },
                            };
                        }}
                    />
                </div>
            </div>
        </WrapperProductManagement>
    )
};

export default UserManagementComponent;