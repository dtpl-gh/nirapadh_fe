'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { fetchSystemConfigById, updateSystemConfig } from '../lib/api';
import { SystemConfig } from '../lib/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditSystemConfigPage({ params }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    // Unwrap params using React.use() or await in async wrapper if server component, 
    // but this is client component so we need to handle the promise.
    const [configId, setConfigId] = useState<string | null>(null);

    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        configValue: '',
        description: '',
    });

    useEffect(() => {
        params.then((p) => setConfigId(p.id));
    }, [params]);

    useEffect(() => {
        if (!configId) return;

        const loadConfig = async () => {
            try {
                setLoading(true);
                const data = await fetchSystemConfigById(configId);
                // Handle potential nested data structure
                const configData = (data as any).data || data;
                setConfig(configData);

                let displayValue = '';
                if (configData.configValue !== undefined && configData.configValue !== null) {
                    displayValue = typeof configData.configValue === 'object'
                        ? JSON.stringify(configData.configValue, null, 2)
                        : String(configData.configValue);
                }

                setFormData({
                    configValue: displayValue,
                    description: configData.description || '',
                });
            } catch (err) {
                console.error('Failed to fetch config', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load system configuration.',
                    variant: 'destructive',
                });
                router.push('/setting/system-config');
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [configId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!configId) return;

        try {
            setSaving(true);

            let payloadValue = formData.configValue;
            try {
                const trimmed = formData.configValue.trim();
                // Simple check if it looks like JSON object or array
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                    payloadValue = JSON.parse(trimmed);
                }
            } catch (e) {
                // Not valid JSON, send as string
            }

            await updateSystemConfig(configId, {
                configValue: payloadValue,
                description: formData.description
            });

            toast({
                title: 'Success',
                description: 'Configuration updated successfully.',
            });
            router.push('/setting/system-config');
        } catch (err) {
            console.error('Failed to update config', err);
            toast({
                title: 'Error',
                description: 'Failed to update system configuration.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Configuration</h1>
                    <p className="text-gray-500">{config.configKey}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="key">Config Key</Label>
                        <Input
                            id="key"
                            value={config.configKey}
                            disabled
                            className="bg-gray-50 font-mono text-sm"
                        />
                        <p className="text-xs text-gray-400">Key cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">Value (JSON or String)</Label>
                        <Textarea
                            id="value"
                            value={formData.configValue}
                            onChange={(e) => setFormData({ ...formData, configValue: e.target.value })}
                            className="font-mono min-h-[100px]"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
