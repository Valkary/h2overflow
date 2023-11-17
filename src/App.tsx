import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/ui/navbar";

export default function App() {
  const { user } = useContext(AuthContext);

  return <div>
    <Navbar />
    <Dashboard />
  </div>
}
