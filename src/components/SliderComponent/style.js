import { styled } from "styled-components";

export const WrapperSliderSection = styled.div`
    .slick-arrow.slick-prev {
        left: 28px;
        z-index: 1;
        width: 24px;
    }

    .slick-arrow.slick-next {
        right: 28px;
        z-index: 1;
        width: 24px;
    }

    .slick-prev:before, .slick-next:before {
        font-family: 'slick';
        font-size: 35px;
        line-height: 1;
        opacity: .50;
        color: white;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .slick-dots {
        bottom: 15px;
    }

    .slick-dots li.slick-active button:before {
        opacity: .75;
        color: black;
    }

    .slick-dots li button:before {
        font-family: 'slick';
        font-size: 10px;
        line-height: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        content: '•';
        text-align: center;
        opacity: .25;
        color: black;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    
`