import React from 'react';
import { Card, Image, Row } from 'antd';
import { CardWrapper, NameProduct, PriceProduct } from './style';
import { useNavigate } from "react-router-dom";
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { toggleFavoriteProduct } from '../../redux/slices/favoriteSlice';

const CardComponent = (props) => {
    const { id, user, favorite, countInStock, description, name, price, rating, type, sold, discount, image } = props;

    const isFavProduct = favorite?.favoriteItems?.find(item => {
        return item?.favoriteProductId === id;
    });


    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleNavigateProductDetails = (id, e) => {
        // if click on favorite icon
        if (e.target.tagName === "svg" || e.target.tagName === "path") {

        } else {
            navigate(`/menu/products/${id}`);
        }
    }
    const handleAddFavoriteProduct = (id) => {
        dispatch(toggleFavoriteProduct({
            favoriteProductId: id,
            favoriteProductName: name,
            favoriteProductImage: image,
            favoriteProductPrice: price,
            userId: user?.id,
         }));
    }

    return (
        <CardWrapper
            hoverable
            style={{
                position: 'relative',
            }}
            className='card-item-product'
            onClick={e => handleNavigateProductDetails(id, e)}
        >
            <div style={{ position: 'absolute', right: '20px' }}>
                {
                    isFavProduct === undefined && user?.id
                    &&
                    <HeartOutlined style={{ fontSize: '30px', color: 'grey' }} onClick={() => handleAddFavoriteProduct(id)} />
                }
                {
                    isFavProduct !== undefined && user?.id
                    &&
                    <HeartFilled style={{ fontSize: '30px', color: 'red' }} onClick={() => handleAddFavoriteProduct(id)} />
                }
            </div>
            <Row justify="center" style={{ height: '180px' }}>
                <Image className='card-item-product-image' src={image} preview={false} height={180} draggable={false} />
            </Row>
            <NameProduct style={{ marginTop: '20px' }}>{name}</NameProduct>
            <PriceProduct>{price?.toLocaleString()} VNĐ</PriceProduct>
        </CardWrapper>
    )
};

export default CardComponent
