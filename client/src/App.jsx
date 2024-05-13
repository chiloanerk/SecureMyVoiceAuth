import {Route, Routes} from "react-router-dom";
import {Login, Signup} from "./pages/index.js";
import Home from "./pages/Home.jsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </div>
    );
}

export default App;