import { Row } from "antd";
import { styled } from "styled-components";

export const StarRating = styled.div`
    margin-top: 20px;
    font-size: 18px;
    display: flex;
    align-items: center;

    .checked {
        padding-right: 4px;
        color: rgb(253, 216, 54);
    }

    .unchecked {
        padding-right: 4px;
        color: #000;
    }
`

export const DetailContentDiv = styled.div`
    margin-top: 20px; 
    font-size: 18px; 
    line-height: 1.5; 
    display: flex; 
    align-items: center;
`

export const PriceSpan = styled.span`
    margin-left: 40px; 
    font-size: 28px; 
    font-weight: bold; 
    user-select: none;
`

export const DetailsReviewSection = styled(Row)`
    margin-top: 70px;

    .ant-tabs-nav-wrap {
        justify-content: center;
    }

    :where(.css-dev-only-do-not-override-17a39f8).ant-tabs .ant-tabs-tab+.ant-tabs-tab {
        margin: 0 0 0 64px;
    }

    :where(.css-dev-only-do-not-override-17a39f8).ant-tabs .ant-tabs-tab {
        position: relative;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        display: inline-flex;
        align-items: center;
        padding: 12px 0;
        font-size: 16px;
        background: transparent;
        border: 0;
        outline: none;
        cursor: pointer;
        user-select: none;
    }
`

export const InputNumberCustom = styled.div`
    position: relative; 
    font-size: 18px; 
    line-height: 1.5; 
    display: inline-flex; 
    align-items: center;

    .minus-input-number {
        position: absolute; 
        font-size: 22px; 
        z-index: 1;
        left: 10px;
    }

    .plus-input-number {
        position: absolute; 
        font-size: 22px; 
        z-index: 1;
        right: 10px;
    }

    .ant-input-number-handler-wrap {
        display: none;
    }

    .ant-input-number-input-wrap {
        display: flex;
        align-items: center;
        height: 100%;
        text-align: center;
    }

    .ant-input-number-input {
        text-align: center;
    }

    .input-number-area {
        height: 40px;
        width: 100px;
        border: 1px solid #000;
        font-size: 20px;
    }

    .ant-input-number {
        background-color: whitesmoke;
    }
`