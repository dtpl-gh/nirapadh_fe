import React, { ReactNode } from 'react';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { PredefinedRole } from '@/app/lib/rbac';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UserProvider } from '@/components/UserContext';

interface LayoutProps {
    children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let user = { userId: '', role: null as string | null, exp: 0 };
    const isAuthenticated = !!token;

    if (token) {
        try {
            console.log("Layout: Token found in cookies");
            const decoded = jose.decodeJwt(token);
            console.log("Layout: Decoded JWT:", JSON.stringify(decoded, null, 2));

            let role = (decoded.scope as string) || (decoded.role as any) || PredefinedRole.ROLE_CLIENT;

            user = {
                userId: (decoded.userId as string) || (decoded.sub as string) || '',
                role: role,
                exp: (decoded.exp as number) || 0,
            };
            console.log("Layout: Constructed User:", user);
        } catch (e) {
            console.error("Failed to decode token in layout", e);
        }
    } else {
        console.log("Layout: No token found in cookies");
    }

    const userData = {
        userId: user.userId,
        role: user.role,
        isAuthenticated
    };

    return (
        <UserProvider user={userData}>
            <div className="flex h-screen bg-gray-50">
                <Sidebar userId={user.userId} role={user.role} isAuthenticated={isAuthenticated} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header userId={user.userId} role={user.role} isAuthenticated={isAuthenticated} />
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
            </div>
        </UserProvider>
    );
}
