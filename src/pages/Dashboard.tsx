import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, []);

    return <section className="bg-green-300 flex-grow">
        <h1>Add activity</h1>
    </section>
}