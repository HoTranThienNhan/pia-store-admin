import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DollarOutlined,
    FieldNumberOutlined,
    FileTextOutlined,
    FormOutlined,
    InboxOutlined,
    InfoCircleOutlined,
    PartitionOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    TagOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Col, Divider, Form, Image, Input, Modal, Popconfirm, Popover, Row, Select, Space, Steps, Switch, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import TableComponent from '../../TableComponent/TableComponent';
import { CollapseWrapper, OrdersCard, SelectForm, WrapperProductManagement, WrapperUploadProductImage } from './style';
import FloatingLabelComponent from '../../FloatingLabelComponent/FloatingLabelComponent';
import InputFormComponent from '../../InputFormComponent/InputFormComponent';
import { convertDateType, convertOrderStatus, getBase64, getTotalAmountOrder } from '../../../utils';
import * as ProductService from '../../../services/ProductService';
import * as OrderService from '../../../services/OrderService';
import { useMutationHooks } from '../../../hooks/useMutationHook';
import LoadingComponent from '../../LoadingComponent/LoadingComponent';
import * as MessagePopup from '../../../components/MessagePopupComponent/MessagePopupComponent';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const OrderManagementComponent = () => {
    /*** USE STATE ***/
    const user = useSelector((state) => state?.user);

    const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
    const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] = useState(false);

    // loading update and active product when waiting for getting all products
    const [isLoadingUpdateProduct, setIsLoadingUpdateProduct] = useState(false);
    const [isLoadingActiveProduct, setIsLoadingActiveProduct] = useState(false);

    const [productState, setProductState] = useState({
        id: '',
        name: '',
        type: '',
        image: '',
        countInStock: '',
        price: '',
        rating: '',
        description: '',
        sold: 0,
        active: true,
    });
    const [selectedType, setSelectedType] = useState('');
    const [selectedUpdateType, setSelectedUpdateType] = useState('');
    const [updateProductState, setUpdateProductState] = useState({
        id: '',
        name: '',
        type: '',
        image: '',
        countInStock: '',
        price: '',
        rating: '',
        description: ''
    });
    const [activeProductState, setActiveProductState] = useState({
        active: true
    });

    const [selectedRow, setSelectedRow] = useState('');
    const [selectedActiveRow, setSelectedActiveRow] = useState('');

    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    /*** RENDER TABLE ***/
    // #region
    const renderTableOrderDetails = () => {
        return (
            <div>
                <InfoCircleOutlined style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleGetOrderDetails} />
                {/* <FormOutlined className='all-products-update' style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleUpdateProductDetails} /> */}
            </div>
        );
    }
    // #endregion


    /*** GET ALL PRODUCTS ***/
    // #region
    const getAllProducts = async () => {
        const res = await ProductService.getAllProducts();
        return res;
    }
    const queryAllProducts = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts
    });
    const { isLoading: isLoadingAllProducts, data: allProducts } = queryAllProducts;
    // #endregion





    /*** GET ALL ORDERS ***/
    // #region
    const getAllOrdersByAdmin = async () => {
        const res = await OrderService.getAllOrdersByAdmin();
        return res;
    }
    const queryAllOrders = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrdersByAdmin
    });
    const { isLoading: isLoadingAllOrders, data: allOrders } = queryAllOrders;
    // #endregion




    /*** ALL PRODUCT TYPES ***/
    // #region
    const getAllProductTypes = async () => {
        const res = await ProductService.getAllProductTypes();
        return res;
    }
    const queryAllProductTypes = useQuery({
        queryKey: ['productTypes'],
        queryFn: getAllProductTypes
    });
    const { isLoading: isLoadingAllProductTypes, data: allProductTypes } = queryAllProductTypes;

    const [allTypes, setAllTypes] = useState([]);
    const [newType, setNewType] = useState('');
    const inputNewTypeRef = useRef(null);

    const handleOnChangeNewType = (e) => {
        setNewType(e.target.value);
    }

    const addNewTypeItem = (e) => {
        e.preventDefault();
        if (newType !== '') {
            setAllTypes([...allTypes, newType]);
        }
        setNewType('');
        setTimeout(() => {
            inputNewTypeRef?.current?.focus();
        }, 0);
    };

    const handleOnChangeSelect = (value) => {
        setSelectedType(value);
        setProductState({
            ...productState,
            type: value
        });
    }

    const handleOnChangeSelectUpdate = (value) => {
        setSelectedUpdateType(value);
        setUpdateProductState({
            ...updateProductState,
            type: value
        });
    }
    // #endregion


    /*** SEARCH ***/
    // #region
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
    // #endregion


    /*** COLUMNS TABLE AND TABLE DATA ***/
    // #region
    const columnsOrders = [
        {
            title: 'Mã Đơn',
            dataIndex: 'id',
            className: 'all-orders-id',
            sorter: (a, b) => a.id.localeCompare(b.id),
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Tên Người Đặt',
            dataIndex: 'fullname',
            className: 'all-orders-user-name',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
            ...getColumnSearchProps('fullname'),
        },
        {
            title: 'Số Lượng SP',
            dataIndex: 'totalAmount',
            className: 'all-orders-amount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Phương Thức',
            dataIndex: 'method',
            className: 'all-orders-type',
            filters: [
                {
                    text: 'Tất Cả',
                    value: 'all',
                },
                {
                    text: 'COD',
                    value: 'COD',
                },
                {
                    text: 'Paypal',
                    value: 'Paypal',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                if (value === 'all') {
                    return record.method;
                } else {
                    return record.method === value;
                }
            },
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'totalPrice',
            className: 'all-orders-total-price',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            filters: [
                {
                    text: 'Tất Cả',
                    value: 'all',
                },
                {
                    text: '< 100.000 VNĐ',
                    value: '< 100000',
                },
                {
                    text: '>= 100.000 VNĐ',
                    value: '>= 100000',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                if (value === 'all') {
                    return record.totalPrice;
                } else if (value === '< 100000') {
                    return record.totalPrice < 100000;
                } else if (value === '>= 100000') {
                    return record.totalPrice >= 100000;
                }
            },
        },
        {
            title: 'Ngày Đặt',
            dataIndex: 'createdAt',
            render: (data) => <span>{convertDateType(data)}</span>,
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        },
        {
            title: 'Chi Tiết',
            dataIndex: 'details',
            render: renderTableOrderDetails
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Tất Cả',
                    value: 'all',
                },
                {
                    text: 'Chờ Xác Nhận',
                    value: 'pending',
                },
                {
                    text: 'Chờ Lấy Hàng',
                    value: 'pickingup',
                },
                {
                    text: 'Đang giao',
                    value: 'delivering',
                },
                {
                    text: 'Đã giao',
                    value: 'delivered',
                },
                {
                    text: 'Đã hủy',
                    value: 'canceled',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => {
                if (value === 'all') {
                    return record.status;
                } else if (value === 'pending') {
                    return record.status == 'Chờ Xác Nhận';
                } else if (value === 'pickingup') {
                    return record.status == 'Chờ Lấy Hàng';
                }
                else if (value === 'delivering') {
                    return record.status == 'Đang Giao';
                }
                else if (value === 'delivered') {
                    return record.status == 'Đã Giao';
                }
                else if (value === 'canceled') {
                    return record.status == 'Đã Hủy';
                }
            },
        }
    ];
    // set unique data-row-key for each row of table
    const dataOrdersTable = allOrders?.data?.length && allOrders?.data?.map((order) => {
        return {
            ...order,
            key: order._id,
            id: order._id,
            fullname: order.deliveryInformation.fullname,
            totalAmount: getTotalAmountOrder(order),
            method: order.paymentMethod,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            status: convertOrderStatus(order.status),
        }
    });
    // #endregion


    /*** CREATE PRODUCT ***/
    // #region
    // mutation
    const mutation = useMutationHooks(
        (data) => {
            const {
                id,
                name,
                type,
                image,
                countInStock,
                price,
                rating,
                description,
                sold,
                active
            } = data;
            const res = ProductService.createProduct({
                id,
                name,
                type,
                image,
                countInStock,
                price,
                rating,
                description,
                sold,
                active
            });
            return res;
        }
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    // use effect
    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            MessagePopup.success();
            handleCreateProductCancel();
        } else if (data?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccess, isError]);

    // get lastest product id and create new product id
    const getLastestProductId = () => {
        const allProductsCount = allProducts?.data?.length;
        const lastestProductId = allProducts?.data[allProductsCount - 1]?.id; // lastestProductId pattern: example is SP001
        const newProductId = lastestProductId?.slice(0, 2) + (parseInt(lastestProductId?.slice(2)) + 1)?.toString()?.padStart(3, 0);
        return newProductId;
    }

    // handle create product modals
    const showCreateProductModal = () => {
        setIsCreateProductModalOpen(true);
        setAllTypes(allProductTypes?.data);
        const newProductId = getLastestProductId();
        setProductState({
            ...productState,
            id: newProductId
        });
    };
    const onCreateProductFinish = () => {
        mutation.mutate(
            productState,
            {
                onSettled: () => {
                    queryAllProducts.refetch();
                    queryAllProductTypes.refetch();
                }
            }
        );
    }
    const handleCreateProductOk = () => {
        onCreateProductFinish();
    };
    const handleCreateProductCancel = () => {
        setIsCreateProductModalOpen(false);
        setSelectedType('');
        setProductState({
            id: '',
            name: '',
            type: '',
            image: '',
            countInStock: '',
            price: '',
            rating: '',
            description: ''
        });
    };
    const handleCreateProductOnChangeImage = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setProductState({
            ...productState,
            image: file.preview
        });
    }
    const handleCreateProductRemoveImage = () => {
        setProductState({
            ...productState,
            image: ''
        });
    }
    const handleOnChangeProductState = (e) => {
        setProductState({
            ...productState,
            [e.target.name]: e.target.value
        });
    }
    // #endregion


    /*** UPDATE PRODUCT ***/
    // #region
    // mutation update product
    const mutationUpdateProduct = useMutationHooks(
        ({ id, accessToken, updatedData } = data) =>
            ProductService.updateProduct(id, updatedData, accessToken)
    );
    const { data: dataUpdate, isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdateProduct;

    // use effect selected row on table
    useEffect(() => {
        if (selectedRow) {
            getUpdateProductDetails(selectedRow);
        }
    }, [selectedRow]);

    // use effect
    useEffect(() => {
        if (isSuccessUpdate && dataUpdate?.status === "OK") {
            MessagePopup.success();
            handleUpdateProductCancel();
            getAllProducts();
        } else if (dataUpdate?.status === "ERR") {
            MessagePopup.error();
        }
    }, [isSuccessUpdate, isErrorUpdate]);

    // get update product details and fill into the update product modal
    const getUpdateProductDetails = async (id) => {
        const res = await ProductService.getProductDetails(id);
        if (res?.data) {
            setUpdateProductState({
                id: res?.data?.id,
                name: res?.data?.name,
                type: res?.data?.type,
                image: res?.data?.image,
                countInStock: res?.data?.countInStock,
                price: res?.data?.price,
                rating: res?.data?.rating,
                description: res?.data?.description
            });
        }
        setIsLoadingUpdateProduct(false);
    }
    const handleUpdateProductDetails = () => {
        setIsLoadingUpdateProduct(true);
        if (selectedRow) {
            getUpdateProductDetails(selectedRow);
        }
        showUpdateProductModal();
    }

    // handle update product modals
    const showUpdateProductModal = () => {
        setIsUpdateProductModalOpen(true);
        setAllTypes(allProductTypes?.data);
    };
    const handleUpdateProductCancel = () => {
        setIsUpdateProductModalOpen(false);
        setSelectedRow(null);
        setUpdateProductState({
            id: '',
            name: '',
            type: '',
            image: '',
            countInStock: '',
            price: '',
            rating: '',
            description: ''
        });
    };
    const handleUpdateProductRemoveImage = () => {
        setUpdateProductState({
            ...updateProductState,
            image: ''
        });
    }
    const handleUpdateProductOnChangeImage = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setUpdateProductState({
            ...updateProductState,
            image: file.preview
        });
    }
    const handleOnChangeUpdateProductState = (e) => {
        setUpdateProductState({
            ...updateProductState,
            [e.target.name]: e.target.value
        });
    }
    const onUpdateProductFinish = () => {
        mutationUpdateProduct.mutate(
            {
                id: selectedRow,
                accessToken: user?.accessToken,
                updatedData: updateProductState
            },
            {
                onSettled: () => {
                    queryAllProducts.refetch();
                }
            }
        );
    }
    const handleUpdateProductOk = () => {
        onUpdateProductFinish();
    };
    // #endregion





    /*** ORDER DETAILS ***/
    // #region
    const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [selectedOrderRow, setSelectedOrderRow] = useState('');
    const [orderDetailsState, setOrderDetailsState] = useState({
        _id: "",
        deliveryInformation: {},
        orderItems: [],
        paymentMethod: "",
        subtotalPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        status: "",
        user: "",
        createdAt: "",
        updatedAt: "",
        isDelivered: "",
        isPaid: "",
    });

    // use effect selected row on table
    useEffect(() => {
        if (selectedOrderRow) {
            handleGetOrderDetails(selectedOrderRow);
        }
    }, [selectedOrderRow]);

    // get order details and fill into the order details modal
    const getOrderDetails = async (id) => {
        const res = await OrderService.getOrderDetails(id);
        if (res?.data) {
            setOrderDetailsState({
                _id: res?.data?._id,
                deliveryInformation: res?.data?.deliveryInformation,
                orderItems: res?.data?.orderItems,
                paymentMethod: res?.data?.paymentMethod,
                subtotalPrice: res?.data?.subtotalPrice,
                shippingPrice: res?.data?.shippingPrice,
                totalPrice: res?.data?.totalPrice,
                status: res?.data?.status,
                user: res?.data?.user,
                createdAt: res?.data?.createdAt,
                updatedAt: res?.data?.updatedAt,
                isDelivered: res?.data?.isDelivered,
                isPaid: res?.data?.isPaid,
            });
        }
        setIsLoadingOrderDetails(false);
    }
    const handleGetOrderDetails = () => {
        setIsLoadingOrderDetails(true);
        if (selectedOrderRow) {
            getOrderDetails(selectedOrderRow);
        }
        showOrderDetailsModal();
    }

    // handle order details modals
    const showOrderDetailsModal = () => {
        setIsOrderDetailsModalOpen(true);
    };
    const handleOrderDetailsCancel = () => {
        setIsOrderDetailsModalOpen(false);
        setSelectedOrderRow(null);
        setOrderDetailsState({
            _id: "",
            deliveryInformation: {},
            orderItems: [],
            paymentMethod: "",
            subtotalPrice: 0,
            shippingPrice: 0,
            totalPrice: 0,
            status: "",
            user: "",
            createdAt: "",
            updatedAt: "",
            isDelivered: "",
            isPaid: "",
        });
    };
    const onOrderDetailsFinish = () => {
        // mutationUpdateProduct.mutate(
        //     {
        //         id: selectedRow,
        //         accessToken: user?.accessToken,
        //         updatedData: updateProductState
        //     },
        //     {
        //         onSettled: () => {
        //             queryAllProducts.refetch();
        //         }
        //     }
        // );
    }
    const handleOrderDetailsOk = () => {
        onOrderDetailsFinish();
    };
    // #endregion


    /*** ORDER ITEMS ***/
    const items = (order) => [
        {
            key: '1',
            label: `Chi tiết đơn hàng (${order?.orderItems?.length ? order?.orderItems?.length : 0} mặt hàng)`,
            children:
                order?.orderItems?.map((orderItems, index) => {
                    return (
                        <>
                            <Row>
                                <Col span={6}>
                                    <Image src={orderItems?.image} preview={false} width={130} />
                                </Col>
                                <Col span={12}>
                                    <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
                                        {orderItems?.name}
                                    </div>
                                    <Row>
                                        <Col span={4}>
                                            <div>Số lượng:</div>
                                            <div>Đơn giá:</div>
                                        </Col>
                                        <Col span={10}>
                                            <div>{orderItems?.amount} </div>
                                            <div>{orderItems?.price?.toLocaleString()}  VNĐ</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {index + 1 !== order?.orderItems?.length && (<Divider />)}
                        </>
                    )
                })
        },
    ];


    const [currentOrderStatus, setCurrentOrderStatus] = useState(0);
    const mutationUpdateOrderStatus = useMutationHooks(
        (data) => {
            const { orderId, accessToken, order, status } = data;
            const res = OrderService.updateOrderState(orderId, accessToken, order, status);
            return res;
        }
    );
    const onChangeOrderStatus = (order) => {
        const recentStatus = order?.status;
        let status = "pending";

        if (recentStatus === "pending") {
            status = "pickingup";
        } else if (recentStatus === "pickingup") {
            status = "delivering";
        } else if (recentStatus === "delivering") {
            status = "delivered";
        }
        mutationUpdateOrderStatus.mutate({
            orderId: order?._id,
            accessToken: user?.accessToken,
            order: order,
            status: status,
        },
            {
                onSuccess: () => {
                    MessagePopup.success("Cập nhật trạng thái đơn hàng thành công.");
                    // refresh status in orders table
                    queryAllOrders.refetch();
                    // refresh status in order model
                    handleGetOrderDetails(selectedOrderRow);
                }
            }
        );
    };


    /*** CANCEL ORDER ***/
    const mutationCancelOrder = useMutationHooks(
        (data) => {
            const { orderId, accessToken, order } = data;
            const res = OrderService.cancelOrder(orderId, accessToken, order);
            return res;
        }
    );
    const handleCancelOrder = (order) => {
        mutationCancelOrder.mutate({
            orderId: order?._id,
            accessToken: user?.accessToken,
            order: order
        },
            {
                onSuccess: () => {
                    MessagePopup.success("Hủy đơn hàng thành công.");
                    // refresh status in orders table
                    queryAllOrders.refetch();
                    // refresh status in order model
                    handleGetOrderDetails(selectedOrderRow);
                }
            });
    }
    const cancelOrder = (order) => {
        if (convertOrderStatus(order?.status) === "Chờ Xác Nhận" || convertOrderStatus(order?.status) === "Chờ Lấy Hàng") {
            handleCancelOrder(order);
        }
    }


    /*** STATUS STEPS ITEMS ***/
    const statusItem = (order) => {
        let orderStatusStep = 0;
        if (convertOrderStatus(order?.status) === "Chờ Xác Nhận") {
            orderStatusStep = 0;
        } else if (convertOrderStatus(order?.status) === "Chờ Lấy Hàng") {
            orderStatusStep = 1;
        } else if (convertOrderStatus(order?.status) === "Đang Giao") {
            orderStatusStep = 2;
        } else if (convertOrderStatus(order?.status) === "Đã Giao") {
            orderStatusStep = 3;
        } else if (convertOrderStatus(order?.status) === "Đã Hủy") {
            orderStatusStep = 4;
        }
        return [
            {
                title: "Chờ Xác Nhận",
                icon:
                    <Button
                        type={orderStatusStep === 0 ? "primary" : "default"}
                        shape="circle"
                        style={
                            orderStatusStep === 0
                                ? {}
                                : orderStatusStep === 4
                                    ? { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
                                    : { backgroundColor: '#e6f4ff', borderColor: '#e6f4ff' }}
                    >
                        {orderStatusStep === 0
                            ? 1
                            : orderStatusStep === 4
                                ? <CloseOutlined style={{ color: '#fff' }} />
                                : <CheckOutlined style={{ color: '#1677ff' }} />}
                    </Button>
            },
            {
                title: 'Chờ Lấy Hàng',
                icon:
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận cập nhật"
                        description={<span>Bạn chắc chắn muốn cập nhật <br /> sang trạng thái <b>Chờ Xác Nhận</b>?</span>}
                        onConfirm={() => onChangeOrderStatus(order)}
                        okText="Chắc chắn"
                        cancelText="Không"
                        disabled={orderStatusStep === 0 ? false : true}
                    >
                        <Button
                            type={orderStatusStep === 1 ? "primary" : "default"}
                            shape="circle"
                            style={
                                orderStatusStep === 1
                                    ? {}
                                    : orderStatusStep < 1
                                        ? { backgroundColor: '#0000000f', borderColor: 'transparent' }
                                        : orderStatusStep === 4
                                            ? { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
                                            : { backgroundColor: '#e6f4ff', borderColor: '#e6f4ff' }

                            }
                        >
                            {orderStatusStep <= 1
                                ? 2
                                : orderStatusStep === 4
                                    ? <CloseOutlined style={{ color: '#fff' }} />
                                    : <CheckOutlined style={{ color: '#1677ff' }} />}
                        </Button>
                    </Popconfirm>
            },
            {
                title: 'Đang Giao',
                icon:
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận cập nhật"
                        description={<span>Bạn chắc chắn muốn cập nhật <br /> sang trạng thái <b>Đang Giao</b>?</span>}
                        onConfirm={() => onChangeOrderStatus(order)}
                        okText="Chắc chắn"
                        cancelText="Không"
                        disabled={orderStatusStep === 1 ? false : true}
                    >
                        <Button
                            type={orderStatusStep === 2 ? "primary" : "default"}
                            shape="circle"
                            style={
                                orderStatusStep === 2
                                    ? {}
                                    : orderStatusStep < 2
                                        ? { backgroundColor: '#0000000f', borderColor: 'transparent' }
                                        : orderStatusStep === 4
                                            ? { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
                                            : { backgroundColor: '#e6f4ff', borderColor: '#e6f4ff' }

                            }
                        >
                            {orderStatusStep <= 2
                                ? 3
                                : orderStatusStep === 4
                                    ? <CloseOutlined style={{ color: '#fff' }} />
                                    : <CheckOutlined style={{ color: '#1677ff' }} />}
                        </Button>
                    </Popconfirm>
            },
            {
                title: 'Đã Giao',
                icon:
                    <Popconfirm
                        placement='topRight'
                        title="Xác nhận cập nhật"
                        description={<span>Bạn chắc chắn muốn cập nhật <br /> sang trạng thái <b>Đã Giao</b>?</span>}
                        onConfirm={() => onChangeOrderStatus(order)}
                        okText="Chắc chắn"
                        cancelText="Không"
                        disabled={orderStatusStep === 2 ? false : true}
                    >
                        <Button
                            type={"default"}
                            shape="circle"
                            style={
                                orderStatusStep === 3
                                    ? { backgroundColor: '#e6f4ff', borderColor: '#e6f4ff' }
                                    : orderStatusStep < 3
                                        ? { backgroundColor: '#0000000f', borderColor: 'transparent' }
                                        : { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }

                            }
                        >
                            {orderStatusStep < 3
                                ? 4
                                : orderStatusStep === 3
                                    ? <CheckOutlined style={{ color: '#1677ff' }} />
                                    : <CloseOutlined style={{ color: '#fff' }} />}
                        </Button>
                    </Popconfirm>
            },
        ];
    }




    /*** NAVIGATE ***/
    // #region
    const navigate = useNavigate();
    const handleNavigateHomePage = () => {
        navigate('/');
    }
    // #endregion


    return (
        <WrapperProductManagement>
            <div style={{ userSelect: 'none' }}>
                <h2 style={{ fontWeight: 'bold' }}>Quản Lý Đơn Hàng</h2>
                <Breadcrumb
                    items={[
                        {
                            title: <span onClick={handleNavigateHomePage} style={{ cursor: 'pointer' }}>Trang chủ</span>,
                        },
                        {
                            title: 'Quản lý đơn hàng',
                        },
                    ]}
                />
            </div>
            <LoadingComponent isLoading={isLoadingAllProducts}>
                <div style={{ padding: '30px 0px' }}>
                    <div className='all-products all-products-area'>
                        <div className='all-products-header'>
                            <span className='all-products-title'>Tất Cả Đơn Hàng</span>
                            <span style={{ userSelect: 'none', color: '#7b7b7b' }}>|</span>
                            <span className='all-products-quantity'>
                                {dataOrdersTable ? dataOrdersTable?.length : 0}
                            </span>
                        </div>
                        <TableComponent
                            columns={columnsOrders}
                            data={dataOrdersTable}
                            // isLoading={isLoadingAllProducts}
                            excelFileName="OrdersTable"
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        const orderIdKey = event.target.closest('tr').getAttribute('data-row-key');
                                        if (event.target.tagName === 'svg' || event.target.tagName === 'path') {
                                            setSelectedOrderRow(orderIdKey);
                                        }
                                    },
                                };
                            }}
                        />
                    </div>
                </div>
            </LoadingComponent>


            {/* Modal Order Details */}
            <Modal
                title="Chi Tiết Đơn Hàng"
                open={isOrderDetailsModalOpen}
                maskClosable={false}
                width="950px"
                closeIcon={null}
                footer={[
                    <Button type="primary" key="back" onClick={handleOrderDetailsCancel}>
                        OK
                    </Button>
                ]}>
                <LoadingComponent isLoading={isLoadingOrderDetails}>
                    <LoadingComponent isLoading={isLoadingUpdate}>
                        <div style={{ padding: '25px' }}>
                            <Row justify="space-between">
                                <Col span={9}>
                                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                                        MÃ ĐƠN #{orderDetailsState?._id}
                                    </div>
                                    <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                                        Tổng Tiền: {orderDetailsState?.totalPrice?.toLocaleString()} VNĐ
                                    </div>
                                    <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                                        Số Lượng: {getTotalAmountOrder(orderDetailsState)} sản phẩm
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        Ngày Đặt Hàng: {convertDateType(orderDetailsState?.createdAt)}
                                    </div>
                                </Col>
                                <Col span={7} style={{ alignItems: 'center' }}>
                                    <h4>THÔNG TIN ĐƠN HÀNG</h4>
                                    <div style={{ fontSize: '14px', margin: '2px 0px 6px 0px' }}>
                                        Phương Thức Thanh Toán: {orderDetailsState?.paymentMethod}
                                    </div>
                                    <div style={{ marginBottom: '6px' }}>
                                        Phí Vận Chuyển: {orderDetailsState?.shippingPrice?.toLocaleString()} VNĐ
                                    </div>
                                    <div>
                                        Trạng Thái: {convertOrderStatus(orderDetailsState?.status)}
                                    </div>
                                </Col>
                                <Col span={6} style={{ alignItems: 'center' }}>
                                    <h4>THÔNG TIN NGƯỜI NHẬN</h4>
                                    <div style={{ fontSize: '14px', margin: '2px 0px 6px 0px' }}>
                                        Họ Tên: {orderDetailsState?.deliveryInformation?.fullname}
                                    </div>
                                    <div style={{ marginBottom: '6px' }}>
                                        Số Điện Thoại: {orderDetailsState?.deliveryInformation?.phone}
                                    </div>
                                    <div>
                                        Nơi Giao: {orderDetailsState?.deliveryInformation?.address}
                                    </div>
                                    {/* {order?.status === 'pending' && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <Popconfirm
                                                            placement='topRight'
                                                            title="Xác nhận hủy đơn hàng"
                                                            description={<span>Bạn chỉ có thể hủy với đơn hàng ở trạng thái <b>Chờ xác nhận</b>.<br />
                                                                Bạn chắc chắn muốn hủy đơn hàng này không?</span>}
                                                            onConfirm={() => handleCancelOrder(order)}
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
                                                            <Button type="primary" danger>
                                                                Hủy Đơn Hàng
                                                            </Button>
                                                        </Popconfirm>
                                                    </div>
                                                )} */}
                                </Col>
                            </Row>

                            <Row style={{ marginTop: '35px' }}>
                                <Col span={20}>
                                    <Steps
                                        current={convertOrderStatus(orderDetailsState?.status) === "Chờ Xác Nhận" ? 0 :
                                            convertOrderStatus(orderDetailsState?.status) === "Chờ Lấy Hàng" ? 1 :
                                                convertOrderStatus(orderDetailsState?.status) === "Đang Giao" ? 2 :
                                                    convertOrderStatus(orderDetailsState?.status) === "Đã Giao" ? 3 : 4
                                        }
                                        // status='error'
                                        labelPlacement="vertical"
                                        items={statusItem(orderDetailsState)}
                                    />
                                </Col>
                                <Col span={4}>
                                    <Popconfirm
                                        placement='topRight'
                                        title="Xác nhận hủy"
                                        description="Bạn chắc chắn muốn hủy đơn hàng này?"
                                        onConfirm={() => cancelOrder(orderDetailsState)}
                                        okText="Chắc chắn"
                                        cancelText="Không"
                                        disabled={
                                            orderDetailsState?.status === 'pending' ||
                                                orderDetailsState?.status === 'pickingup'
                                                ? false
                                                : true}
                                        icon={
                                            <QuestionCircleOutlined
                                                style={{
                                                    color: 'red',
                                                }}
                                            />
                                        }
                                    >
                                        <Button
                                            type='primary'
                                            danger
                                            disabled={
                                                orderDetailsState?.status === 'pending' ||
                                                    orderDetailsState?.status === 'pickingup'
                                                    ? false
                                                    : true}
                                        >
                                            Hủy Đơn Hàng
                                        </Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            <Divider />
                            <CollapseWrapper ghost items={items(orderDetailsState)} />
                        </div>
                    </LoadingComponent>
                </LoadingComponent>
            </Modal>
        </WrapperProductManagement>
    )
};

export default OrderManagementComponent;