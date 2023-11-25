import { Avatar, Breadcrumb, Button, Card, Col, Form, Modal, Popconfirm, Row, Spin, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react';
import FloatingLabelComponent from '../../components/FloatingLabelComponent/FloatingLabelComponent';
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent';
import { DeleteOutlined, HomeOutlined, IdcardOutlined, LockOutlined, PhoneOutlined, PlusOutlined, QuestionCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { WrapperUploadUserAvatar, WrapperUserEditProfile } from './style';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as MessagePopup from '../../components/MessagePopupComponent/MessagePopupComponent';
import { updateUser } from '../../redux/slices/userSlice';
import { getBase64 } from '../../utils';
import { useNavigate } from 'react-router-dom';

const UserEditProfilePage = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [fullname, setFullname] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [address, setAddress] = useState(user?.address);
    const [avatar, setAvatar] = useState(user?.avatar);

    // mutation
    const mutation = useMutationHooks(
        ({ id, accessToken, ...rests } = data) =>
            UserService.updateUser(id, rests, accessToken)
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    // useEffect to show in the inputs on every time changing the user information
    useEffect(() => {
        setFullname(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    // get user details to show for frontend sides after every time updating the user information
    useEffect(() => {
        if (isSuccess) {
            MessagePopup.success();
            handleGetUserDetails(user?.id, user?.accessToken);
        } else if (isError) {
            MessagePopup.error();
        }
    }, [isSuccess, isError]);

    // hooks
    const handleOnChangeFullname = (e) => {
        setFullname(e.target.value);
    }

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    }

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    }

    const handleRemoveAvatar = () => {
        setAvatar('');
    }

    const handleGetUserDetails = async (id, accessToken) => {
        // res contains user information
        const res = await UserService.getUserDetails(id, accessToken);
        dispatch(updateUser({ ...res?.data, accessToken: accessToken }));
    }

    const handleSaveEditProfile = async () => {
        // parse these data into UserService to update new data
        await mutation.mutateAsync({
            id: user?.id,
            fullname,
            email,
            phone,
            address,
            avatar,
            accessToken: user?.accessToken
        });
        navigate('/user/profile');
    }

    const handleCancelEditProfile = async () => {
        navigate('/user/profile');
    }
    const handleNavigateHomePage = async () => {
        navigate('/system/admin');
    }

    return (
        <WrapperUserEditProfile id="container" style={{ padding: '125px 70px 40px 70px', height: '900px', backgroundColor: '#e5e8ed' }}>
            <Breadcrumb
                style={{ paddingLeft: '24px', marginBottom: '20px', userSelect: 'none' }}
                items={[
                    {
                        title: <span onClick={handleNavigateHomePage} style={{ cursor: 'pointer' }}>Trang chủ</span>,
                    },
                    {
                        title: <span>Thông tin người dùng</span>,
                    },
                ]}
            >
            </Breadcrumb>
            <Row>
                <Col span={6}>
                    <div></div>
                </Col>
                <Col span={14}>
                    <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '24px' }}>CHỈNH SỬA THÔNG TIN</div>
                    <Col span={24}>
                        <Card style={{ padding: '0px 30px', borderRadius: '25px' }}>
                            <Form autoComplete="off">
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-avatar'
                                >
                                    <WrapperUploadUserAvatar>
                                        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>Ảnh đại diện</div>
                                        <div style={{ display: 'grid' }}>
                                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                {avatar ?
                                                    (<img className='edit-uploaded-user-avatar' src={avatar} alt='avatar' />) :
                                                    <Avatar className='edit-default-avatar' size={90} icon={<UserOutlined />} />}
                                            </div>
                                            <div>
                                                <Upload onChange={handleOnChangeAvatar} maxCount={1}>
                                                    <Button className='edit-avatar-upload-button' icon={<UploadOutlined />} type='primary' ghost>
                                                        Upload
                                                    </Button>
                                                </Upload>
                                                {avatar &&
                                                    <Button className='edit-avatar-remove-button' icon={<DeleteOutlined />} onClick={handleRemoveAvatar} danger>
                                                        Remove
                                                    </Button>}
                                            </div>
                                        </div>
                                    </WrapperUploadUserAvatar>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-fullname'
                                >
                                    <FloatingLabelComponent
                                        label="Họ tên"
                                        value={fullname}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            placeholder=""
                                            prefix={<IdcardOutlined className="site-form-item-icon" />}
                                            className='edit-input-fullname'
                                            value={fullname}
                                            onChange={handleOnChangeFullname}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-email'
                                >
                                    <FloatingLabelComponent
                                        label="Tài khoản email"
                                        value={email}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            placeholder=""
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            className='edit-input-email'
                                            value={email}
                                            onChange={handleOnChangeEmail}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-phone'
                                >
                                    <FloatingLabelComponent
                                        label="Số điện thoại"
                                        value={phone}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            placeholder=""
                                            prefix={<PhoneOutlined className="site-form-item-icon" />}
                                            className='edit-input-phone'
                                            value={phone}
                                            onChange={handleOnChangePhone}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px', width: '450px' }}
                                    className='edit-form-item-address'
                                >
                                    <FloatingLabelComponent
                                        label="Địa chỉ"
                                        value={address}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputFormComponent
                                            placeholder=""
                                            prefix={<HomeOutlined className="site-form-item-icon" />}
                                            className='edit-input-address'
                                            value={address}
                                            onChange={handleOnChangeAddress}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item style={{ width: '450px' }}>
                                    <Row>
                                        <Col span={12} style={{ paddingRight: '15px' }}>
                                            <Popconfirm
                                                placement='bottomRight'
                                                title="Xác nhận hủy"
                                                description="Bạn chắc chắn muốn hủy thao tác?"
                                                onConfirm={handleCancelEditProfile}
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
                                                <Button
                                                    htmlType='submit'
                                                    className='edit-button-cancel'
                                                    danger
                                                >
                                                    Hủy
                                                </Button>
                                            </Popconfirm>
                                        </Col>
                                        <Col span={12} style={{ paddingLeft: '15px' }}>
                                            <LoadingComponent isLoading={isLoading}>
                                                <Popconfirm
                                                    placement='bottomLeft'
                                                    title="Xác nhận cập nhật thông tin"
                                                    description="Bạn chắc chắn muốn cập nhật thông tin này?"
                                                    onConfirm={handleSaveEditProfile}
                                                    okText="Chắc chắn"
                                                    cancelText="Không"
                                                >
                                                    <Button
                                                        // disabled={!fullname.length
                                                        //     || !email.length
                                                        //     || !phone.length}
                                                        type="primary"
                                                        htmlType='submit'
                                                        className='edit-button-save'
                                                        danger
                                                    >
                                                        Lưu
                                                    </Button>
                                                </Popconfirm>
                                            </LoadingComponent>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Col>
            </Row>
        </WrapperUserEditProfile>
    )
};

export default UserEditProfilePage;
