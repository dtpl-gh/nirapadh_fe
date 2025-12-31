'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { fetchIndustryById, updateIndustry } from '../lib/api';
import { Switch } from '@/components/ui/switch';

interface EditIndustryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditIndustryPage({ params }: EditIndustryPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        industryName: '',
        status: true,
    });

    const industryId = React.use(params).id;

    useEffect(() => {
        const loadIndustry = async () => {
            try {
                setLoading(true);
                const industry = await fetchIndustryById(industryId);
                setFormData({
                    industryName: industry.industryName,
                    status: industry.status,
                });
            } catch (err) {
                console.error('Failed to fetch industry', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load industry details.',
                    variant: 'destructive',
                });
                router.push('/setting/industry');
            } finally {
                setLoading(false);
            }
        };

        if (industryId) {
            loadIndustry();
        }
    }, [industryId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateIndustry(industryId, formData);
            toast({
                title: 'Success',
                description: 'Industry updated successfully.',
            });
            router.push('/setting/industry');
        } catch (err) {
            console.error('Failed to update industry', err);
            toast({
                title: 'Error',
                description: 'Failed to update industry.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
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
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Industry</h1>
                    <p className="text-gray-500">Update industry information.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="industryName">Industry Name</Label>
                        <Input
                            id="industryName"
                            value={formData.industryName}
                            onChange={(e) => setFormData({ ...formData, industryName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="status"
                            checked={formData.status}
                            onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                        />
                        <Label htmlFor="status">Active</Label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Update Industry
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
