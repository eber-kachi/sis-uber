import TokenStorageService from "@lib/tokenStoraje";
import { useRouter } from "next/router";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { AuthService } from "src/services/api/Auth.service";
import { Bounce, toast } from 'react-toastify';

export interface User {
    id: string
    createdAt: string
    updatedAt: string
    role: string
    email: string
    activo: boolean
    password: string
    socio: any
    cliente: any
}


type authContextType = {
    user: User | null | undefined;
    role: string | null | undefined;
    tokenValue: string | null | undefined;
    login: (data: {
        email: string;
        password: string;
    }) => void;
    logout: () => void;
};

const authContextDefaultValues: authContextType = {
    role: undefined,
    user: undefined,
    tokenValue: undefined,
    login: (data: {
        email: string;
        password: string;
    }) => { },
    logout: () => { },
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);


type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null | undefined>(
        () => {
            if (typeof window === 'undefined') {
                return null
            }
            try {
                const item = token.getUser()
                // return item ? JSON.parse(item) : initialValue;
                return item as User;
            } catch (error) {
                console.error(error)
                return null
            }
        });

    const router = useRouter()
    const token = new TokenStorageService()
    const authService = new AuthService();

    const [tokenValue, setTokenValue] = useState(() => {
        if (typeof window === 'undefined') {
            return null
        }
        try {
            const item = token.getToken()
            // return item ? JSON.parse(item) : initialValue;
            console.log(item)
            return item == 'null' ? null : item
        } catch (error) {
            console.error(error)
            return null
        }
    });
    const [role, setRole] = useState<string | null>(() => {
        if (typeof window === 'undefined') {
            return null
        }
        const item = token.getUser();
        if (item != '{}') {
            return String(item?.data?.role)
        }
        return null;
    });

    const login = (data: {
        email: string;
        password: string;
    }) => {
        // setUser(true);
        authService
            .login(data)
            .then((res) => {
                console.log('login', res);
                token.saveToken(res?.data?.token?.accessToken);
                setTokenValue(res?.data?.token?.accessToken);
                // setUser(res?.data?.user)
                setRole(res?.data?.user?.role)
                router.push('/dashboard');
            })
            .catch((errors) => {
                // console.log(errors?.response?.data?.message || 'Error.');
                toast.error(errors?.response?.data?.message === 'error.user_not_found' ? 'Usuarios no encontrado.' : 'Error.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                setTokenValue(null);
            });
    };

    const logout = () => {
        // setUser(false);
        setTokenValue(null)
        setRole(null);
        setUser(undefined);
        token.signOut();

        window.location.pathname = '/login'
    };

    const value = {
        tokenValue,
        role,
        user,
        login,
        logout,
    };

    useEffect(() => {
        // onAuthStateChanged((user) => {
        //   // ログイン状態が変化すると呼ばれる
        //   setCurrentUser(user);
        // });
    }, []);



    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}