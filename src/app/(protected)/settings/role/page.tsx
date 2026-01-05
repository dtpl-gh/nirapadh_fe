'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RoleResponse } from './lib/types';
import { fetchRoles, deleteRole } from './lib/api';
import { RoleTable } from './components/RoleTable';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useToast } from '@components/ui/use-toast';
import { Pagination } from '@components/ui/pagination';

const RolePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadRoles = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;
            const data = await fetchRoles({ page, size, search, filters, sort: sortParam });
            setRoles(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error('Failed to fetch roles', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, search, filters, sort, toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadRoles();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [loadRoles]);

    const handleDelete = async (id: string) => {
        try {
            await deleteRole(id);
            toast({
                title: 'Success',
                description: 'Role deleted successfully.',
            });
            loadRoles(); // Refresh list
        } catch (err: any) {
            console.error('Failed to delete role', err);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0); // Reset to first page on search
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
                    <RoleTable
                        roles={roles}
                        onDelete={handleDelete}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sort={sort}
                        onSortChange={handleSortChange}
                        onCreate={() => router.push('/settings/role/create')}
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

export default RolePage;
