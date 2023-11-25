import { styled } from "styled-components";

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
`