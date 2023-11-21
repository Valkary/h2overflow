import Modal from "@/components/sections/CreateActivityModal";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, []);

    return <section className="flex-grow">
        <Modal />
    </section>
}