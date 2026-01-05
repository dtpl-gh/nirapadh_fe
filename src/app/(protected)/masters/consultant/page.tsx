'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ConsultantResponse } from './lib/types';
import { fetchConsultants, deleteConsultant } from './lib/api';
import { fetchUserById } from '@/app/(protected)/masters/user/lib/api';
import { ConsultantTable } from './components/ConsultantTable';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Pagination } from '@/components/ui/pagination';

const ConsultantPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [consultants, setConsultants] = useState<ConsultantResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadConsultants = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;
            const data = await fetchConsultants({ page, size, search, filters, sort: sortParam });

            let consultantList: ConsultantResponse[] = [];
            let total = 0;

            if (Array.isArray(data)) {
                consultantList = data;
                total = 1;
            } else {
                consultantList = data.content;
                total = data.totalPages;
            }

            // Fetch user details
            const enrichedConsultants = await Promise.all(
                consultantList.map(async (consultant) => {
                    try {
                        if (consultant.userId) {
                            const user = await fetchUserById(consultant.userId);
                            return { ...consultant, user };
                        }
                    } catch (error) {
                        console.error(`Failed to fetch user for consultant ${consultant.id}`, error);
                    }
                    return consultant;
                })
            );

            setConsultants(enrichedConsultants);
            setTotalPages(total);
        } catch (err: any) {
            console.error('Failed to fetch consultants', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, search, filters, sort, toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadConsultants();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadConsultants]);

    const handleDelete = async (id: string) => {
        try {
            await deleteConsultant(id);
            toast({
                title: 'Success',
                description: 'Consultant deleted successfully.',
            });
            loadConsultants();
        } catch (err: any) {
            console.error('Failed to delete consultant', err);
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


            <ConsultantTable
                consultants={consultants}
                onDelete={handleDelete}
                onCreate={() => router.push('/masters/consultant/create')}
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

export default ConsultantPage;
