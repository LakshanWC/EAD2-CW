import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";  // Import the Login component
import Home from "./Home";    // Import the Home component
import TransactionHistory from "./TransactionHistory"



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path={"/transaction-history"} element={<TransactionHistory />}/>
            </Routes>
        </Router>
    );
}

export default App;
