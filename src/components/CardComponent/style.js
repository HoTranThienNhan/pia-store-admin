import { Card } from "antd";
import { styled } from "styled-components";

export const NameProduct = styled.div`
    font-size: 15px;
    font-weight: bold;
    text-align: center;
`

export const PriceProduct = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #ce2026;
    text-align: center;
    margin-top: 5px;
`

export const CardWrapper = styled(Card)`
    width: 260px;
    height: 330px;
    padding: 0px 20px 10px 20px;
    background-color: transparent;
    border-radius: 20px;
    border: 4px solid #cacaca;
    transition: transform .2s;

    .card-item-product-image {
        -webkit-filter: drop-shadow(2px 5px 5px #666);
        filter: drop-shadow(2px 5px 5px #666);
    }

    &:hover {
        background-color: whitesmoke;

        .card-item-product-image {
            transform: scale(1.2);
            -webkit-filter: drop-shadow(2px 5px 5px #666);
            filter: drop-shadow(2px 5px 5px #666);
        }
    }

`