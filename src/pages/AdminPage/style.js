import { Menu } from "antd";
import { styled } from "styled-components";

export const WrapperAdminMenuSidebar = styled(Menu)`
    width: 100%;
    height: 100%;
    font-weight: bold;
    color: #535b98;
    padding: 20px 10px 0px 10px;
    box-shadow: 3px 0px 3px #cacaca8a !important;
    min-height: 600px;

    .ant-menu-item.ant-menu-item-selected, 
    .ant-menu-item.ant-menu-item-active {
        border-radius: 5px;
        user-select: none;
    }
`