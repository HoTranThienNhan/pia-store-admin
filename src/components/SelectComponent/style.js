import { Select } from "antd";
import { styled } from "styled-components";


export const SelectForm = styled(Select)`
    .ant-select-selector {
        border-radius: 10px !important;
        padding: 0px 18px !important;
        margin-top: 20px !important;
        border: 1px solid #000 !important;
        height: 45px !important;
    }

    .ant-select-selection-item {
        padding-top: 7px !important;
    }

    .ant-select-arrow {
        padding-top: 15px;
    }
`