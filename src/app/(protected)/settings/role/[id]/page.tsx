'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useToast } from '@components/ui/use-toast';
import { fetchRoleById, updateRole } from '../lib/api';
import { Textarea } from '@components/ui/textarea';

interface EditRolePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditRolePage({ params }: EditRolePageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const roleId = React.use(params).id;

    useEffect(() => {
        const loadRole = async () => {
            try {
                setLoading(true);
                const role = await fetchRoleById(roleId);
                setFormData({
                    name: role.name,
                    description: role.description,
                });
            } catch (err: any) {
                console.error('Failed to fetch data', err);
                router.push('/settings/role');
            } finally {
                setLoading(false);
            }
        };

        if (roleId) {
            loadRole();
        }
    }, [roleId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateRole(roleId, formData);
            toast({
                title: 'Success',
                description: 'Role updated successfully.',
            });
            router.push('/settings/role');
        } catch (err: any) {
            console.error('Failed to update role', err);
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
                    <h1 className="text-2xl font-bold tracking-tight">Edit Role</h1>
                    <p className="text-gray-500">Update role information.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
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
                            Update Role
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
