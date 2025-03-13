import { useNavigate } from 'react-router-dom';
import React from "react";
import "./UiStyel.css";

function Login() {
    const navigate = useNavigate();

    const loginClicked = () => {
        // After the login logic, navigate to the Home page
        navigate('/Home');
    };
    
    return (
        <div className={"login-container"}>
            //adooooo
            <h1><center>Welcome to ABC Bank</center></h1>
            <div className={"center-middle"}>
                <div className={"center-box"}>
                    UserName <input type={"text"} placeholder={"user name"} /><br /><br />
                    Password <input type={"password"} placeholder={"*******"} /><br /><br /><br />

                    <button>SignUp</button>  <button onClick={loginClicked}>Login</button>
                </div>
            </div>
            <div className={"page-footer"}>
                    welcome to ABC bank
            </div>
        </div>
    );
}


export default Login;
