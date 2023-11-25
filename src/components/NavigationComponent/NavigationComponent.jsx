import React from 'react';
import { useNavigate } from "react-router-dom";

const NavigationComponent = ({name, navigateTo}) => {
   const navigate = useNavigate();
   
   const handleNavigateItems = (path) => {
      navigate(path);
   }
   return (
      <div style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => handleNavigateItems(navigateTo)}>
         {name}
      </div>
   )
};

export default NavigationComponent
