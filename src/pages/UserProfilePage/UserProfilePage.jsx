import { Avatar, Breadcrumb, Card, Col, ColorPicker, Image, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { convertDateType } from '../../utils';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { UserOutlined } from '@ant-design/icons';

const UserProfilePage = () => {
  const user = useSelector((state) => state?.user);

  const [thisUser, setThisUser] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserDetails = async () => {
    const res = await UserService.getUserDetails(user?.id, user?.accessToken);
    if (res?.status === 'OK') {
      setThisUser(res?.data);
    }
  }
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      fetchUserDetails();
      setIsLoading(false);
    }
  }, [user]);


  const recommnededColors = [
    '#000000',
    '#000000E0',
    '#000000A6',
    '#00000073',
    '#00000040',
    '#00000026',
    '#0000001A',
    '#00000012',
    '#0000000A',
    '#00000005',
    '#F5222D',
    '#FA8C16',
    '#FADB14',
    '#8BBB11',
    '#52C41A',
    '#13A8A8',
    '#1677FF',
    '#2F54EB',
    '#722ED1',
    '#EB2F96',
    '#F5222D4D',
    '#FA8C164D',
    '#FADB144D',
    '#8BBB114D',
    '#52C41A4D',
    '#13A8A84D',
    '#1677FF4D',
    '#2F54EB4D',
    '#722ED14D',
    '#EB2F964D',
  ]

  const [colorBackgroundUser, setColorBackgroundUser] = useState('#f4c8ff');

  const changeColorBackgroundUser = (value) => {
    setColorBackgroundUser(value.toHexString());
  }

  // navigate
  const navigate = useNavigate();
  const handleNavigateToEditUserProfile = () => {
    navigate('/user/profile/edit');
  }
  const handleNavigateHomePage = () => {
    navigate('/system/admin');
  }

  return (
    <div id="container" style={{ padding: '125px 70px 60px 70px', height: '100%', backgroundColor: '#e5e8ed' }}>
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
      <Row justify="center">
        <Col span={18}>
          <div style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '24px' }}>THÔNG TIN NGƯỜI DÙNG</div>
          <LoadingComponent isLoading={isLoading}>
            <Card style={{ borderRadius: '25px' }}>
              <Row style={{ position: 'relative', marginBottom: '90px' }}>
                <Col span={24}>
                  <Row style={{
                    backgroundColor: colorBackgroundUser,
                    height: '120px',
                    borderTopLeftRadius: '17px',
                    borderTopRightRadius: '17px',
                    borderBottomRightRadius: '17px',
                  }}>
                  </Row>
                  <Row>
                    <Col style={{ position: 'absolute', top: '55px', left: '15px' }}>
                      <Avatar className="user-avatar-info" alt="avatar"
                        style={{ height: '140px', width: '140px', backgroundColor: '#fff' }} />
                    </Col>
                    <Col style={{ position: 'absolute', top: '60px', left: '20px' }}>
                      {thisUser?.avatar
                        ? <Avatar className="user-avatar-info" src={thisUser?.avatar} alt="avatar" style={{ height: '130px', width: '130px' }} />
                        : <Avatar
                          className='edit-default-avatar'
                          alt='avatar'
                          style={{ height: '130px', width: '130px', paddingTop: '30px' }}
                          icon={<UserOutlined style={{ fontSize: '60px' }} />}
                        />
                      }
                    </Col>
                    <Col style={{ position: 'absolute', top: '140px', left: '170px' }}>
                      <span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '20px' }}>{thisUser?.fullname ? thisUser?.fullname : 'Username'}</span>
                    </Col>
                    <Col style={{ position: 'absolute', top: '80px', right: '40px' }}>
                      <ColorPicker
                        value={colorBackgroundUser}
                        onChange={changeColorBackgroundUser}
                        presets={[
                          {
                            label: 'Recommended',
                            colors: recommnededColors,
                          },
                          {
                            label: 'Recent',
                            colors: [
                              'F4C8FF',
                            ],
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: '24px' }}>
                <Col span={24}>
                  <span style={{ fontWeight: '700', fontSize: '18px' }}>Thông Tin Chi Tiết</span>
                </Col>
                <Col span={24} style={{ color: '#989797' }}>
                  Cập nhật thông tin chi tiết ở đây.
                  <span style={{ cursor: 'pointer', color: '#4194ae', fontWeight: '700' }} onClick={handleNavigateToEditUserProfile}> Cập Nhật</span>
                </Col>
                <Col span={24} style={{ marginTop: '15px' }}>
                  <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Số Điện Thoại
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>{thisUser?.phone ? thisUser?.phone : 'User Phone'}</span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Địa Chỉ
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>{thisUser?.address ? thisUser?.address : 'User Address'}</span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Email
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>{thisUser?.email ? thisUser?.email : 'User Email'}</span>
                    </Col>
                  </Row>
                  {/* <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Mô Tả Bản Thân
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>{thisUser?.description ? thisUser?.description : 'Chưa có mô tả.'}</span>
                    </Col>
                  </Row> */}
                  <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Mật Khẩu
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>******</span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: '12px' }}>
                    <Col span={6} style={{ fontWeight: '600', color: '#989797' }}>
                      Ngày Tham Gia
                    </Col>
                    <Col>
                      <span style={{ fontWeight: '600' }}>{thisUser?.createdAt ? convertDateType(thisUser?.createdAt) : 'dd/mm/YYYY'}</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </LoadingComponent>
        </Col>
      </Row>
    </div>
  )
};

export default UserProfilePage;
