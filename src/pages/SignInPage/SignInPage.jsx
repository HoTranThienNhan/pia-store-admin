import { Button, Col, Form, Image, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import imagePoster from '../../assets/images/admin-login.png';
import { AuthCard } from './style';
import { useNavigate } from 'react-router-dom';
import InputPasswordComponent from '../../components/InputPasswordComponent/InputPasswordComponent';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import FloatingLabelComponent from '../../components/FloatingLabelComponent/FloatingLabelComponent';
import * as MessagePopup from '../../components/MessagePopupComponent/MessagePopupComponent';
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';
import { createOrderState } from '../../redux/slices/orderSlice';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector((state) => state.user);

    // mutation
    const mutation = useMutationHooks(
        data => UserService.signinAdminUser(data)
    );

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            // if accessToken exists
            if (data?.accessToken) {
                navigate('/system/admin');
                MessagePopup.success();
                // keep accessToken stored in the browser
                localStorage.setItem('accessToken', JSON.stringify(data?.accessToken));
                // decoded contains elements (id, isAdmin) of access token payload
                const decoded = jwt_decode(data?.accessToken);
                if (decoded?.id) {
                    // update user state
                    handleGetUserDetails(decoded.id, data?.accessToken);
                }
            } else {
                MessagePopup.error();
            }
        } else if (isError) {
            MessagePopup.error();
        }
    }, [isSuccess, isError]);

    useEffect(() => {
        // if sign in success, before navigate to homepage, create order and favorite state for this user
        dispatch(createOrderState(user?.id));
        // if user state is updated, navigate to homepage
        if (user?.id) {
            handleNavigateHomepage();
        }
    }, [user]);

    // navigation
    const handleNavigateHomepage = () => {
        navigate('/');
    }

    const handleGetUserDetails = async (id, accessToken) => {
        // res contains user information
        const res = await UserService.getUserDetails(id, accessToken);
        dispatch(updateUser({ ...res?.data, accessToken: accessToken }));
    }

    // hooks
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnChangePassword = (e) => {
        setPassword(e);
    }

    const handleSignin = () => {
        mutation.mutate({
            email,
            password
        });
    }

    return (
        <div style={{ padding: '0px 130px', height: '700px' }}>
            <AuthCard>
                <Row>
                    <Col span={15} style={{ padding: '32px 64px' }}>
                        <h2 style={{ marginBottom: '48px' }}>
                            Chào mừng đến <span onClick={handleNavigateHomepage} style={{ cursor: 'pointer' }}>PIASTORE ADMIN</span>
                        </h2>
                        <Col style={{ padding: '20px 50px' }}>
                            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>
                                Đăng Nhập Tài Khoản Admin
                            </h1>
                            <Form autoComplete="off">
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='auth-form-item-email'
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
                                            className='auth-input-email'
                                            value={email}
                                            onChange={handleOnChangeEmail}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='auth-form-item-password'
                                >
                                    <FloatingLabelComponent
                                        label="Mật khẩu"
                                        value={password}
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <InputPasswordComponent
                                            placeholder=""
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            className='auth-input-password'
                                            value={password}
                                            onChange={handleOnChangePassword}
                                        />
                                    </FloatingLabelComponent>
                                </Form.Item>

                                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                <Form.Item>
                                    <LoadingComponent isLoading={isLoading}>
                                        <Button
                                            disabled={!email.length || !password.length}
                                            type="primary"
                                            htmlType='submit'
                                            onClick={handleSignin}
                                            className='auth-button-signin'
                                            danger
                                        >
                                            Đăng Nhập
                                        </Button>
                                    </LoadingComponent>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Col>
                    <Col span={9}>
                        <Image src={imagePoster} preview={false} height={300} style={{ marginTop: '100px' }} />
                    </Col>
                </Row>
            </AuthCard>
        </div>
    )
};

export default SignInPage
