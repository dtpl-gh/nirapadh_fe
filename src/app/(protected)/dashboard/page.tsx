'use client';

import { useUser } from '@/components/UserContext';
import { PredefinedRole } from '@/app/lib/rbac';
import AdminDashboard from './components/admin-dashboard/index';
import ConsultantDashboard from './components/consultant-dashboard/index';
import ClientDashboard from './components/client-dashboard/index';

export default function Dashboard() {
    const { role } = useUser();

    if (role === PredefinedRole.ROLE_ADMIN) {
        return <AdminDashboard />;
    }

    if (role === PredefinedRole.ROLE_CONSULTANT) {
        return <ConsultantDashboard />;
    }

    if (role === PredefinedRole.ROLE_CLIENT) {
        return <ClientDashboard />;
    }

    // Fallback or generalized view
    return (
        <div className="flex h-full items-center justify-center p-6 text-center">
            <div>
                <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
                <p className="mt-2 text-gray-600">Please select an item from the menu to begin.</p>
            </div>
        </div>
    );
}
