import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Home from "./Components/Home/Home";
import NavBar from "./Components/Home/NavBar";
import AllFiles from "./Components/Files/AllFiles";
import SharedFiles from "./Components/Files/SharedFiles";

function App() {
  
  return (
    <>
      <Router>
         <NavBar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/allfiles" element={<AllFiles/>}/>
          <Route path="/sharedFiles" element={<SharedFiles/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
