'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleResponse } from './lib/types';
import { fetchRoles, deleteRole } from './lib/api';
import { RoleTable } from './components/RoleTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RolePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await fetchRoles();
            // Handle potential response structure differences
            const roleList = Array.isArray(data) ? data : (data as any).data || [];
            setRoles(roleList);
        } catch (err) {
            console.error('Failed to fetch roles', err);
            toast({
                title: 'Error',
                description: 'Failed to load roles.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteRole(id);
            toast({
                title: 'Success',
                description: 'Role deleted successfully.',
            });
            loadRoles(); // Refresh list
        } catch (err) {
            console.error('Failed to delete role', err);
            toast({
                title: 'Error',
                description: 'Failed to delete role.',
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Role Management</h1>
                    <p className="text-gray-500 mt-1">Manage application roles and permissions.</p>
                </div>
                <Button onClick={() => router.push('/setting/role/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <RoleTable roles={roles} onDelete={handleDelete} />
        </div>
    );
};

export default RolePage;
