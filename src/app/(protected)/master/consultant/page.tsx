'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConsultantResponse } from './lib/types';
import { fetchConsultants, deleteConsultant } from './lib/api';
import { ConsultantTable } from './components/ConsultantTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ConsultantPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [consultants, setConsultants] = useState<ConsultantResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadConsultants = async () => {
        try {
            setLoading(true);
            const data = await fetchConsultants();
            const consultantList = Array.isArray(data) ? data : (data as any).data || [];
            setConsultants(consultantList);
        } catch (err) {
            console.error('Failed to fetch consultants', err);
            toast({
                title: 'Error',
                description: 'Failed to load consultants.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConsultants();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteConsultant(id);
            toast({
                title: 'Success',
                description: 'Consultant deleted successfully.',
            });
            loadConsultants();
        } catch (err) {
            console.error('Failed to delete consultant', err);
            toast({
                title: 'Error',
                description: 'Failed to delete consultant.',
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Consultant Management</h1>
                    <p className="text-gray-500 mt-1">Manage consultants.</p>
                </div>
                <Button onClick={() => router.push('/master/consultant/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <ConsultantTable consultants={consultants} onDelete={handleDelete} />
        </div>
    );
};

export default ConsultantPage;
