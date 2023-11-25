import { Card } from "antd";
import { styled } from "styled-components";

export const AuthCard = styled(Card)`
    border-radius: 25px;
    border: 2px solid #000; 
    margin: 70px 100px;

    .ant-card-body {
        padding: 0px;
    }

    &:where(.css-dev-only-do-not-override-17a39f8).ant-card .ant-card-body {
        padding: 0px;
        border-radius: 0 0 8px 8px;
    }

    .auth-input-email, .auth-input-password {
        height: 45px;
        border-radius: 25px;
        padding: 0px 18px;
        margin-top: 20px; 
        border: 1px solid #000;
    }
    
    .auth-input-email .ant-input, 
    .auth-input-password .ant-input {
        padding-top: 7px;
    }

    .auth-button-signin {
        height: 50px; 
        width: 100%; 
        border-radius: 25px; 
        margin-bottom: 20px; 
        margin-top: 20px;
    }
`