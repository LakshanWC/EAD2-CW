import React from "react";
import { useNavigate } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showWithdrawForm: false, // Controls whether the withdraw form is displayed
        };
    }

    render() {
        return (
            <div>
                <div className="nav-bar-line">
                    <button className="nav-button">Account</button>
                    <select className="nav-button" id="dropdown" onChange={this.handleDropdownChange}>
                        <option value="0">Transaction</option>
                        <option value="1">Withdraw</option>
                        <option value="3">Deposit</option>
                        <option value="4">Transfer</option>
                        <option value="5">Transaction History</option>
                    </select>
                    <button className="nav-button">Loan</button>
                    <button className="nav-aline-right" onClick={this.handleLogout}>Logout</button>
                </div>

                {/* Render Withdraw Form if showWithdrawForm is true */}
                {this.state.showWithdrawForm && this.makeWithdrawComponent()}
            </div>
        );
    }

    handleLogout = () => {
        this.props.navigate("/");
    };

    handleDropdownChange = (event) => {
        const value = event.target.value;
        if (value === "5") {
            this.goToTransactionHistory();
        } else if (value === "1") {
            this.setState({ showWithdrawForm: true }); // Show the withdraw form
        } else {
            this.setState({ showWithdrawForm: false }); // Hide form for other selections
        }
    };

    goToTransactionHistory = () => {
        this.props.navigate("/transaction-history");
    };

    // Function to render the Withdraw Form
    makeWithdrawComponent = () => {
        return (
            <div className={"center-middle"}>
                <div className={"center-box"} style={{marginTop:"100px"}}>
                    <label>Account Number </label>
                    <input type={"text"} style={{marginBottom:"50px"}}placeholder={"Account Number"}/> <br />
                    <label style={{marginLeft:"10px"}}>Amount </label>
                    <input type={"number"} style={{marginBottom:"20px"}}/><br />
                    <button>WithDraw</button>
                </div>
            </div>
        );
    };

    makeDepositeComponent =() =>{
        return(
            <div></div>
        );
    }
}

function HomeWithNavigate(props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}

export default HomeWithNavigate;
