// import React, {useState} from "react";
// import { useNavigate } from 'react-router-dom';

// import './button.css'

// /**
//  * @param  text - a string to show on the button
//  * @param  type - 0 -> small, 1 -> normal, 2 -> large, 3 -> alt
//  * @param  toPage - a page you want to redirect to onClick
//  */
// const ButtonComponent = ({text="Click Me!",type='1',toPage=""}) => {
    
//     const types = {
//         0:"small",
//         1:"",
//         2:"large",
//         3:"form"
//     };
    
//     const navigate = useNavigate();
//     function handleClick() {
//         navigate(toPage);
//     };

//     return (
//         <button className={types[type]} onClick={handleClick}>{text}</button>
//     );
// }

// export default ButtonComponent;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './button.css';

const ButtonComponent = ({ text, toPage, type }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(toPage);
    };

    return (
        <button 
            onClick={handleClick} 
            className={type === '2' ? 'startPlanning' : ''}
        >
            {text}
        </button>
    );
};

export default ButtonComponent;
