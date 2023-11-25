import { Avatar, Col, Image, Rate, Row } from 'antd';
import React from 'react';
import { AllReviewsRow } from './style';
import { convertDateType } from '../../utils';

const ProductReviewsComponent = (props) => {
    const { productReviewsArray } = props;

    return (
        <div>
            {productReviewsArray?.map((review) => {
                return (
                    <Row style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e3e3e3' }}>
                        <Col align="end" span={3} style={{ paddingRight: '15px' }}>
                            <Avatar src={review?.userDetails[0]?.avatar} size={48} />
                        </Col>
                        <Col span={20}>
                            <AllReviewsRow>
                                <Col span={24} className='review-header'>
                                    <Row justify="space-between">
                                        <Col>
                                            <span className='review-fullname'>{review?.userDetails[0]?.fullname}</span>
                                            <span className='review-date'>{convertDateType(review?.createdAt)}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24} className='review-rating'>
                                    <Rate style={{ fontSize: '16px' }} disabled defaultValue={review?.rating} />
                                </Col>
                                <Col span={24}>
                                    {review?.comment}
                                </Col>
                                <Col span={24} style={{ marginTop: '10px' }}>
                                    <Row>
                                        {review?.images?.map((imageReview) => {
                                            return (
                                                <Col style={{ marginRight: '10px' }}>
                                                    <Image src={imageReview} width={120} />
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Col>
                            </AllReviewsRow>
                        </Col>
                    </Row>
                )
            })}
            {!productReviewsArray && (
                <Row justify="center">
                    <Col style={{ fontSize: '28px', fontWeight: '300', margin: '15px 0px 60px 0px' }}>
                        Chưa có đánh giá
                    </Col>
                </Row>
            )}
        </div>
    )
};

export default ProductReviewsComponent;
