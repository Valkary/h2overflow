import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/sections/Navbar";
import Home from "./pages/Home";

export default function App() {
  const { user } = useContext(AuthContext);

  return <BrowserRouter>
    <div className="w-full min-h-[100vh] flex flex-col">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          user ?
            <>
              <Navbar />
              <Dashboard />
            </> :
            <Navigate to={"/login"} />
        } />
        <Route path="/profile" element={
          user ?
            <>
              <Navbar />
              <Profile />
            </> :
            <Navigate to={"/login"} />
        } />
      </Routes>
    </div>
  </BrowserRouter>
}