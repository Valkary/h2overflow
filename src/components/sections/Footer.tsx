import { Link } from "react-router-dom";

export default function Footer() {
    return <footer className="bg-white">
        <div
            className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8"
        >
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="flex flex-shrink-0 items-center font-bold text-xl">
                    <img src="/gota.png" className="object-cover object-center" width={25} />
                    H<sub>2</sub>O<sub>verflow</sub>
                </div>

                <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
                    <li>
                        <a
                            href="https://github.com/Valkary/h2overflow/tree/final"
                            rel="noreferrer"
                            target="_blank"
                            className="text-gray-700 transition hover:opacity-75"
                        >
                            <span className="sr-only">GitHub</span>

                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>

            <div
                className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16"
            >
                <Link to="/#about" className="text-gray-700 transition hover:opacity-75">
                    About us
                </Link>
                <Link to="/#contact" className="text-gray-700 transition hover:opacity-75">
                    Contact
                </Link>
                <Link to="/profile" className="text-gray-700 transition hover:opacity-75">
                    Profile
                </Link>
                <Link to="/dashboard" className="text-gray-700 transition hover:opacity-75">
                    Dashboard
                </Link>
            </div>
            <p className="text-xs text-gray-500">
                &copy; 2023. H2Overflow. All rights reserved.
            </p>
        </div>
    </footer>
}