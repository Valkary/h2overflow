import { createContext, useState } from 'react';

type User = {
    username: string,
    token: string,
    name: string,
    last_names: string,
    units: string | null,
    language: string | null
}

type LoginCredentials = {
    email: string,
    password: string
}

type AuthContext = {
    user: User | null,
    login: (creds: LoginCredentials) => void,
    signin: () => void,
    update: () => void
}

export const AuthContext = createContext<AuthContext>({
    user: null,
    login: () => { },
    signin: () => { },
    update: () => { }
});

export default function AuthContextProvider({ children, }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    function login(creds: LoginCredentials) {
        console.log("==> Attempting to log in", creds);

        // Lamada al server

        try {
            setUser({
                username: "Pepe",
                name: "Jose",
                last_names: "Salcedo Uribe",
                language: "english",
                token: "asdasdas",
                units: "kg"
            })
        } catch (err) {
            console.error(err);
        }
    }

    function signin() {

    }

    function update() {

    }

    return <AuthContext.Provider value={{ user, login, signin, update }}>
        {children}
    </AuthContext.Provider>
}