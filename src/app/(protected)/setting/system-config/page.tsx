'use client';

import React, { useEffect, useState } from 'react';
import { SystemConfig } from './lib/types';
import { fetchSystemConfigs } from './lib/api';
import { SystemConfigTable } from './components/SystemConfigTable';
import { Loader2 } from 'lucide-react';

const SystemConfigPage = () => {
    const [configs, setConfigs] = useState<SystemConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadConfigs = async () => {
            try {
                setLoading(true);
                const data = await fetchSystemConfigs();
                // Handle potential different response structures if needed, 
                // but for now assuming API returns array as per typical patterns
                // If wrapped in data: (data as any).data
                if (Array.isArray(data)) {
                    setConfigs(data);
                } else if ((data as any).data && Array.isArray((data as any).data)) {
                    setConfigs((data as any).data);
                } else {
                    setConfigs([]);
                    console.warn('Unexpected API response structure', data);
                }
            } catch (err) {
                console.error('Failed to fetch system configs', err);
                setError('Failed to load system configurations.');
            } finally {
                setLoading(false);
            }
        };

        loadConfigs();
    }, []);

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Configuration</h1>
                    <p className="text-gray-500 mt-1">Manage global system settings and variables.</p>
                </div>
            </div>

            <SystemConfigTable configs={configs} />
        </div>
    );
};

export default SystemConfigPage;
