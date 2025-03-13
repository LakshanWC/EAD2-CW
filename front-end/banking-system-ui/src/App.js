import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";  // Import the Login component
import Home from "./Home";    // Import the Home component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
