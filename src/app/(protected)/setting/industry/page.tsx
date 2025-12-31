'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IndustryResponse } from './lib/types';
import { fetchIndustries, deleteIndustry } from './lib/api';
import { IndustryTable } from './components/IndustryTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const IndustryPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [industries, setIndustries] = useState<IndustryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadIndustries = async () => {
        try {
            setLoading(true);
            const data = await fetchIndustries();
            const industryList = Array.isArray(data) ? data : (data as any).data || [];
            setIndustries(industryList);
        } catch (err) {
            console.error('Failed to fetch industries', err);
            toast({
                title: 'Error',
                description: 'Failed to load industries.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadIndustries();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteIndustry(id);
            toast({
                title: 'Success',
                description: 'Industry deleted successfully.',
            });
            loadIndustries();
        } catch (err) {
            console.error('Failed to delete industry', err);
            toast({
                title: 'Error',
                description: 'Failed to delete industry.',
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Industry Management</h1>
                    <p className="text-gray-500 mt-1">Manage industries.</p>
                </div>
                <Button onClick={() => router.push('/setting/industry/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <IndustryTable industries={industries} onDelete={handleDelete} />
        </div>
    );
};

export default IndustryPage;
