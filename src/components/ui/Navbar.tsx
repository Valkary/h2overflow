import { Button } from "./button";

export default function Navbar() {
    return <nav className="h-[10vh] flex items-center bg-gray-200">
        <img src="/logo.png" className="object-cover object-center h-full" />
        <Button variant={"link"}>Home</Button>
        <Button variant={"link"}>Dashboard</Button>
        <Button variant={"link"}>Profile</Button>
    </nav>
}