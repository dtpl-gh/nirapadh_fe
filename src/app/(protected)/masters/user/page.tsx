'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppUser } from './lib/types';
import { fetchUsers, deleteUser } from './lib/api';
import { UserTable } from './components/UserTable';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';

const UserPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;
            const data = await fetchUsers({ page, size, filters, sort: sortParam });
            setUsers(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, filters, sort, toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadUsers]);

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            toast({
                title: 'Success',
                description: 'User deleted successfully.',
            });
            loadUsers(); // Refresh list
        } catch (err: any) {
            console.error('Failed to delete user', err);
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const handleSortChange = (key: string) => {
        setSort(current => {
            if (current?.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                return null; // Reset sort
            }
            return { key, direction: 'asc' };
        });
    };


    return (
        <div className="p-6 space-y-6">
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <UserTable
                        users={users}
                        onDelete={handleDelete}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sort={sort}
                        onSortChange={handleSortChange}
                        onCreate={() => router.push('/masters/user/create')}
                    />
                    <div className="flex justify-end mt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default UserPage;
