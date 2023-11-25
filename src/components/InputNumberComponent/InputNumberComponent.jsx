import React, { useState } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import { InputNumberCustom } from './style';

const InputNumberComponent = (props) => {
    const { minValue, maxValue } = props;
    const [productCount, setProductCount] = useState(1);

   const addValue = (e) => {
      if (Number(productCount) < Number(maxValue)) {
         setProductCount(Number(productCount) + 1);
      } 
   }

   const minusValue = (e) => {
      if (Number(productCount) > Number(minValue)) {
         setProductCount(Number(productCount) - 1);
      }
   }

   const setValue = (e) => {
      if (e !== null) {
         setProductCount(`${e}`);
      }
   }

    return (
        <InputNumberCustom>
            <MinusCircleOutlined className='minus-input-number' onClick={minusValue} />
            <InputNumber className='input-number-area' min={minValue} max={maxValue} value={productCount} onChange={setValue} />
            <PlusCircleOutlined className='plus-input-number' onClick={addValue} />
        </InputNumberCustom>
    )
};

export default InputNumberComponent
