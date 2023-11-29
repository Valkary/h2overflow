import { createContext, useState } from 'react';
import jwt from "jwt-client";
import axios, { AxiosError } from "axios";
import { h2overflowApi } from '@/h2overflowApi';

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

type UpdateType = {
    username: string,
    password: string,
    name: string,
    last_names: string,
    profile_picture: File
}

type AuthContext = {
    user: User | null,
    login: (creds: LoginCredentials) => void,
    signin: (creds: RegisterCredentials) => void,
    update: (update_info: UpdateType) => void,
    logout: () => void,
    error: { at: Date, msg: string } | null
}


export const AuthContext = createContext<AuthContext>({
    user: null,
    login: () => { },
    signin: () => { },
    update: () => { },
    logout: () => { },
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

    async function requestProfilePicture(token: string): Promise<string> {
        try {
            const profile_picture = await h2overflowApi.get("/users/profile_picture", {
                headers: {
                    authorization: token
                },
                responseType: 'blob'
            });


            return URL.createObjectURL(profile_picture.data);
        } catch (err) {
            return "";
        }
    }

    async function login(creds: LoginCredentials) {
        try {
            const request = await h2overflowApi.post("/users/login", creds);

            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;

                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
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
            const request = await h2overflowApi.post("/users/create", { ...creds, profile_picture: null });

            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;

                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
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

    async function update(update_info: UpdateType) {
        try {
            const formData = new FormData();
            formData.append("profile_picture", update_info.profile_picture);

            const request = await h2overflowApi.post("/users/update", update_info, {
                headers: {
                    authorization: user?.token,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;

                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
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

    function logout() {
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, error, login, signin, update, logout }}>
        {children}
    </AuthContext.Provider>
}