import { Row } from "antd";
import { styled } from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 0px 70px;
    background-color: #211616cc;
    position: fixed;
    z-index: 10;
    width: 100%;
`

export const WrapperSearchHeader = styled.div`
    font-size: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;
`

export const WrapperAccountHeader = styled.div`
    font-size: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;

    .user-avatar-header {
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }
`

export const WrapperAuthDiv = styled.div`
    display: flex;

    .ant-spin-nested-loading{
        display: flex;
    }

    .ant-spin-container {
        display: flex;
    }
`

export const WrapperAuthHeader = styled.span`
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-right: 20px;
`

export const WrapperSignoutPopover = styled.p`
    cursor: pointer;
    margin-bottom: 0px;
    margin-top: 5px;
    padding: 5px 8px;

    &:hover {
        background-color: #ff222ec7;
        color: #fff;
    }
`

export const WrapperAccountPopover = styled.p`
    cursor: pointer;
    margin: 0px;
    padding: 5px 8px;

    &:hover {
        background-color: #ff222ec7;
        color: #fff;
    }
`
export const WrapperLinePopover = styled.p`
    margin: 5px 0px;
    border-top: 1px solid #c2c2c2;
`




