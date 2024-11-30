import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

import './App.css'
import Users from "./components/Users";
import {useState} from "react";
import ProtectedRoute from "./shared/ProtectedRoute";
function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
      <div className="App">
        <Routes>
          <Route path="/register" element={<Home/>}/>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />}/>
          <Route path="/users"  element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Users />
               </ProtectedRoute>
          } />
        </Routes>
      </div>
  );
}

export default App;
