import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/sections/Navbar";

export default function App() {
  const { user } = useContext(AuthContext);

  return <BrowserRouter>
    <div className="w-[100vw] min-h-[100vh] flex flex-col">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <>au</>
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