'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ClientResponse } from './lib/types';
import { fetchClients, deleteClient } from './lib/api';
import { ClientTable } from './components/ClientTable';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';

const ClientPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [clients, setClients] = useState<ClientResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadClients = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;
            const data = await fetchClients({ page, size, search, filters, sort: sortParam });

            if (Array.isArray(data)) {
                setClients(data);
                setTotalPages(1);
            } else {
                setClients(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (err: any) {
            console.error('Failed to fetch clients', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, search, filters, sort, toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadClients();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadClients]);

    const handleDelete = async (id: string) => {
        try {
            await deleteClient(id);
            toast({
                title: 'Success',
                description: 'Client deleted successfully.',
            });
            loadClients();
        } catch (err: any) {
            console.error('Failed to delete client', err);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">


            <ClientTable
                clients={clients}
                onDelete={handleDelete}
                filters={filters}
                onFilterChange={handleFilterChange}
                sort={sort}
                onSortChange={handleSortChange}
            />
            <div className="flex justify-end mt-4">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
};

export default ClientPage;
