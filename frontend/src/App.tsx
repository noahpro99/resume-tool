import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HomePage } from './pages/HomePage';
import Login from './pages/Login';
import { useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";


function App() {
  const { token } = useAuth();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;