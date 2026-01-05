'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SystemConfig } from './lib/types';
import { fetchSystemConfigs } from './lib/api';
import { SystemConfigTable } from './components/SystemConfigTable';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@components/ui/input';
import { Pagination } from '@components/ui/pagination';

const SystemConfigPage = () => {
    const [configs, setConfigs] = useState<SystemConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadConfigs = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;
            const data = await fetchSystemConfigs({ page, size, search, filters, sort: sortParam });
            setConfigs(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            console.error('Failed to fetch system configs', err);
            const errorMessage = err.response?.data?.message || 'Failed to load system configurations.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [page, size, search, filters, sort]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadConfigs();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadConfigs]);

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

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-red-50 rounded-lg mx-6 mt-6">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">


            <SystemConfigTable
                configs={configs}
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

export default SystemConfigPage;
