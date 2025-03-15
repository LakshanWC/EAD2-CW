import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {
    render() {
        return <div>
            <h1>Welcome to abc bank   hello </h1>
            is it fixed
        </div>; // Empty div to render nothing
    }
}

function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

export default HomeWithNavigate;
