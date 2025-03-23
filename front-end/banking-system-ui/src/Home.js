// src/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {
    render() {
        const { user } = this.props; // Destructure the user prop

        return (
            <div>
                <h1>Welcome to ABC Bank</h1>
                {user && <p>Hello, {user.username}!</p>} {/* Display the username if user is logged in */}
            </div>
        );
    }
}

function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

export default HomeWithNavigate;