import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type Routes = "home" | "dashboard" | "profile";

export default function Navbar() {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [route, setRoute] = useState<Routes>("home");

    useEffect(() => {
        switch (true) {
            case (location.pathname === "/"): {
                setRoute("home");
                break;
            }
            case (location.pathname.includes("dashboard")): {
                setRoute("dashboard");
                break;
            }
            case (location.pathname.includes("profile")): {
                setRoute("profile");
                break;
            }
        }
    }, [location]);

    return <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <button
                        type="button"
                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                        onClick={() => setOpen(!open)}
                    >
                        <span className="absolute -inset-0.5"></span>
                        <span className="sr-only">Open main menu</span>
                        <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center text-white font-bold text-xl">
                        <img src="/gota.png" className="object-cover object-center" width={25} />
                        H<sub>2</sub>O<sub>verflow</sub>
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <Link to="/" className={`${route === "home" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}>Home</Link>
                            <Link to="/dashboard" className={`${route === "dashboard" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`} aria-current="page">Dashboard</Link>
                            <Link to="/profile" className={`${route === "profile" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}>Profile</Link>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <div className="relative ml-3">
                        <div>
                            <button type="button"
                                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button"
                                aria-expanded="false"
                                aria-haspopup="true"
                                onClick={() => navigate("/profile")}
                            >
                                <span className="absolute -inset-1.5"></span>
                                <span className="sr-only">Open user menu</span>
                                <img className="h-8 w-8 rounded-full object-cover object-center" src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"} alt="Profile picture" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={`${open ? "sm:hidden" : "hidden"}`} id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
                <Link to="/" className={`${route === "home" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`} aria-current="page">Home</Link>
                <Link to="/dashboard" className={`${route === "dashboard" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`}>Dashboard</Link>
                <Link to="/profile" className={`${route === "profile" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`}>Profile</Link>
            </div>
        </div>
    </nav>

}