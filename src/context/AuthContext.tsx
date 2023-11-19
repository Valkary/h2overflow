import { createContext, useState } from 'react';

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
        // TODO: llamada al servidor para iniciar sesión
        try {
            setUser({
                username: "Pepe",
                name: "Jose",
                last_names: "Salcedo Uribe",
                language: "english",
                token: "asdasdas",
                units: "kg",
                profile_picture: null
            })
        } catch (err) {
            console.error(err);
        }
    }

    function signin(creds: RegisterCredentials) {
        // TODO: llamada al servidor para crear un usuario
        console.log(creds);
    }

    function update() {

    }

    return <AuthContext.Provider value={{ user, login, signin, update }}>
        {children}
    </AuthContext.Provider>
}