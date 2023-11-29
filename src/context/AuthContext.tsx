import { createContext, useState } from 'react';
import jwt from "jwt-client";
import axios, { AxiosError } from "axios";

type User = {
    username: string,
    name: string,
    last_names: string,
    units: string | null,
    language: string | null,
    profile_picture: string | null,
    token: string,
}

type LoginCredentials = {
    email: string,
    password: string
}

type RegisterCredentials = {
    username: string,
    password: string,
    email: string,
    last_names: string,
    name: string,
    units: "Lt" | "Gal",
    language: "English" | "Spanish",
}

type AuthContext = {
    user: User | null,
    login: (creds: LoginCredentials) => void,
    signin: (creds: RegisterCredentials) => void,
    update: () => void,
    error: { at: Date, msg: string } | null
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    login: () => { },
    signin: () => { },
    update: () => { },
    error: null
});

export default function AuthContextProvider({ children, }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>({
        language: "",
        last_names: "",
        name: "",
        profile_picture: "",
        token: "",
        units: "",
        username:""
    });
    const [error, setError] = useState<{ at: Date, msg: string } | null>(null);

    async function login(creds: LoginCredentials) {
        try {
            const request = await axios.post("http://localhost:3000/api/users/login", creds);

            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;

                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: data.profile_picture,
                    units: data.units,
                    token: request.data.token
                });
            }
        } catch (err: AxiosError | unknown) {
            if (axios.isAxiosError(err)) {
                if (err?.request?.status === 404) {
                    setError({ msg: "Email not found", at: new Date() });
                } else if (err?.request?.status === 401) {
                    setError({ msg: "Wrong password", at: new Date() });
                } else {
                    setError({ msg: "Internal server error", at: new Date() })
                }

                return;
            }

            setError({ msg: "Internal server error", at: new Date() });
        }
    }

    async function signin(creds: RegisterCredentials) {
        try {
            const request = await axios.post("http://localhost:3000/api/users/create", { ...creds, profile_picture: null });

            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;

                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: data.profile_picture,
                    units: data.units,
                    token: request.data.token
                });
            }
        } catch (err: AxiosError | unknown) {
            if (axios.isAxiosError(err)) {
                if (err?.request?.status === 409) {
                    setError({ msg: "Email already in use", at: new Date() });
                } else if (err?.request?.status === 400) {
                    setError({ msg: "Internal server error", at: new Date() });
                }

                return;
            }

            setError({ msg: "Internal server error", at: new Date() });
        }
    }

    function update() {

    }

    return <AuthContext.Provider value={{ user, login, signin, update, error }}>
        {children}
    </AuthContext.Provider>
}