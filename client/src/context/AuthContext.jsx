import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {

            setToken(storedToken);
            setUser(JSON.parse(storedUser));

        }

        setLoading(false);

    }, []);


    const login = (userData, jwtToken) => {

        localStorage.setItem("token", jwtToken);
        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
        setToken(jwtToken);

    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken("");

    };


    const isAuthenticated = !!token;

    const isAdmin = user?.role_id === 1;

    const isEmployee = user?.role_id === 2;


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated,
                isAdmin,
                isEmployee,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);