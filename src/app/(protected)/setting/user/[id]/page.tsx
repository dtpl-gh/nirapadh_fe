'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { fetchUserById, updateUser } from '../lib/api';
import { AppUser } from '../lib/types';
import { EmailInput } from '@/components/ui/email-input';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditUserPage({ params }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<AppUser | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        enabled: true,
        accountNonLocked: true,
    });

    useEffect(() => {
        params.then((p) => setUserId(p.id));
    }, [params]);

    useEffect(() => {
        if (!userId) return;
        const loadUser = async () => {
            try {
                setLoading(true);
                const data = await fetchUserById(userId);
                // Handle nested data
                const userData = (data as any).data || data;
                setUser(userData);
                setFormData({
                    username: userData.username,
                    email: userData.email,
                    enabled: userData.enabled,
                    accountNonLocked: userData.accountNonLocked,
                });
            } catch (err) {
                console.error('Failed to fetch user', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load user.',
                    variant: 'destructive',
                });
                router.push('/setting/user');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [userId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        try {
            setSaving(true);
            await updateUser(userId, formData);
            toast({
                title: 'Success',
                description: 'User updated successfully.',
            });
            router.push('/setting/user');
        } catch (err) {
            console.error('Failed to update user', err);
            toast({
                title: 'Error',
                description: 'Failed to update user.',
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

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
                    <p className="text-gray-500">{formData.username}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <EmailInput
                            id="email"
                            value={formData.email}
                            onChange={(value) => setFormData({ ...formData, email: value })}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="enabled"
                            checked={formData.enabled}
                            onCheckedChange={(checked) => setFormData({ ...formData, enabled: !!checked })}
                        />
                        <Label htmlFor="enabled">Enabled</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="accountNonLocked"
                            checked={formData.accountNonLocked}
                            onCheckedChange={(checked) => setFormData({ ...formData, accountNonLocked: !!checked })}
                        />
                        <Label htmlFor="accountNonLocked">Account Unlocked</Label>
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
