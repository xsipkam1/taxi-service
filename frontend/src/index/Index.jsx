import LoginForm from "./LoginForm"
import RegistrationForm from './RegistrationForm';
import DriverForm from "./DriverForm";
import IndexNavbar from "./IndexNavbar"
import React, { useState } from 'react';

function Index() {

  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] = useState(false);
  const [isDriverFormVisible, setIsDriverFormVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginFormVisible(!isLoginFormVisible);
    setIsDriverFormVisible(false);
    setIsRegistrationFormVisible(false);
  };

  const handleRegistrationClick = () => {
    setIsRegistrationFormVisible(!isRegistrationFormVisible);
    setIsLoginFormVisible(false); 
  };

  const handleDriverRegistrationClick = () => {
    setIsDriverFormVisible(!isDriverFormVisible);
    setIsRegistrationFormVisible(false);
    setIsLoginFormVisible(false); 
  };

  return (
    <>      
      <IndexNavbar onLoginClick={handleLoginClick} onDriverClick={handleDriverRegistrationClick}/>
      {isDriverFormVisible && (<DriverForm handleExitClick={handleDriverRegistrationClick}/>)}
      {isLoginFormVisible && (<LoginForm handleRegistrationClick={handleRegistrationClick} handleExitClick={handleLoginClick}/>)}
      {isRegistrationFormVisible && (<RegistrationForm handleLoginClick={handleLoginClick} handleExitClick={handleRegistrationClick} />)}
    </>
  )
}

export default Index
