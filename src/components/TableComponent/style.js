import { Button } from "antd";
import { styled } from "styled-components";


export const WrapperTable = styled.div`
    .ant-table-thead {
        user-select: none;
    }
`

export const ButtonExportToExcel = styled(Button)`
    margin-bottom: 20px;
    position: absolute;
    top: 25px;
    right: 25px;
`