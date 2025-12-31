'use client';

import React, { createContext, useContext } from 'react';

interface User {
    userId: string;
    role: any;
    isAuthenticated: boolean;
}

const UserContext = createContext<User>({
    userId: '',
    role: null,
    isAuthenticated: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User;
}) => {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
