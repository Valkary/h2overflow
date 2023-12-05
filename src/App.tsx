import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/sections/Navbar";
import Home from "./pages/Home";
import Footer from "./components/sections/Footer";

export default function App() {
  const { user } = useContext(AuthContext);

  return <BrowserRouter>
    <div className="w-full flex flex-col">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          user ?
            <>
              <Navbar />
              <Dashboard />
              <Footer />
            </> :
            <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          user ?
            <>
              <Navbar />
              <Profile />
              <Footer />
            </> :
            <Navigate to={"/login"} />
        } />
        <Route path="*" element={<>
          <Navbar />
          <div className="flex-grow">404 Not found</div>
          <Footer />
        </>} />
      </Routes>
    </div>
  </BrowserRouter>
}