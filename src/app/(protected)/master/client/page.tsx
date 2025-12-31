'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientResponse } from './lib/types';
import { fetchClients, deleteClient } from './lib/api';
import { ClientTable } from './components/ClientTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ClientPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [clients, setClients] = useState<ClientResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await fetchClients();
            const clientList = Array.isArray(data) ? data : (data as any).data || [];
            setClients(clientList);
        } catch (err) {
            console.error('Failed to fetch clients', err);
            toast({
                title: 'Error',
                description: 'Failed to load clients.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteClient(id);
            toast({
                title: 'Success',
                description: 'Client deleted successfully.',
            });
            loadClients();
        } catch (err) {
            console.error('Failed to delete client', err);
            toast({
                title: 'Error',
                description: 'Failed to delete client.',
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Client Management</h1>
                    <p className="text-gray-500 mt-1">Manage clients.</p>
                </div>
                <Button onClick={() => router.push('/master/client/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <ClientTable clients={clients} onDelete={handleDelete} />
        </div>
    );
};

export default ClientPage;
