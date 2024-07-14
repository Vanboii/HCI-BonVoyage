import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

import './button.css'

/**
 * @param  text - a string to show on the button
 * @param  className - small, large, form, profile
 * @param  toPage - redirect path to onClick
 * @param  onEnter - Text to change to
 * @param  onLeave - redirect path to onClick
 */
const ButtonComponent = ({className='', text="Click Me!", toPage="", action={}, onHover=''}) => {
    
  const [message, setText] = useState(text);

  function handleMouseEnter() { //? to change the text on button hover
    if (onHover !== '') {
      setText(onHover)
    }
  }
  function handleMouseLeave() { //? to set the text back to original
    setText(text)
  }

  // # Page to redirect to
  const navigate = useNavigate();
  function handleClick() {
    if (toPage != "") {
      navigate(toPage);
    } else {
      
      action()
    }


  };

  return (
    <button 
      className={className} 
      onClick={handleClick} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >{message}</button>
  );
}

export default ButtonComponent;