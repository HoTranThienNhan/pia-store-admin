import { Image } from 'antd';
import React from 'react';
import Slider from "react-slick";
import { WrapperSliderSection } from './style';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500
    };
    return (
        <WrapperSliderSection>
            <Slider {...settings}>
                {
                    arrImages.map((image) => {
                        return (
                            <Image key={image} src={image} alt="slider" preview={false} />
                        )
                    })
                }
            </Slider>
        </WrapperSliderSection>
    )
};

export default SliderComponent

