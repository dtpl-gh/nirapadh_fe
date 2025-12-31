'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppUser } from './lib/types';
import { fetchUsers, deleteUser } from './lib/api';
import { UserTable } from './components/UserTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UserPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            // Handle potential response structure differences
            const userList = Array.isArray(data) ? data : (data as any).data || [];
            setUsers(userList);
        } catch (err) {
            console.error('Failed to fetch users', err);
            toast({
                title: 'Error',
                description: 'Failed to load users.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            toast({
                title: 'Success',
                description: 'User deleted successfully.',
            });
            loadUsers(); // Refresh list
        } catch (err) {
            console.error('Failed to delete user', err);
            toast({
                title: 'Error',
                description: 'Failed to delete user.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage application users and permissions.</p>
                </div>
                <Button onClick={() => router.push('/setting/user/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <UserTable users={users} onDelete={handleDelete} />
        </div>
    );
};

export default UserPage;
