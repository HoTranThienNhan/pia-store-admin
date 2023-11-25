import React, { useState } from 'react';
import { SelectForm } from './style';

const SelectComponent = (props) => {
    const { name, children } = props;
    const handleOnChangeInput = (e) => {
        props.onChange(e);
    }
    return (
        <SelectForm name={name}>{children}</SelectForm>
    )
};

export default SelectComponent
