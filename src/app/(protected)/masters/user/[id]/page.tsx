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
import { fetchRoles } from '@/app/(protected)/settings/role/lib/api';
import { AppUser } from '../lib/types';
import { RoleResponse } from '@/app/(protected)/settings/role/lib/types';
import { EmailInput } from '@/components/ui/email-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    const [roles, setRoles] = useState<RoleResponse[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        enabled: true,
        accountNonLocked: true,
        roleId: '',
    });

    useEffect(() => {
        params.then((p) => setUserId(p.id));
    }, [params]);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await fetchRoles({ size: 100 });
                setRoles(response.content);
            } catch (err) {
                console.error('Failed to fetch roles', err);
            }
        };
        loadRoles();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const loadUser = async () => {
            try {
                setLoading(true);
                const userDataRes = await fetchUserById(userId);

                // Handle nested data if any (though types say direct return, checking just in case based on previous code)
                const userData = (userDataRes as any).data || userDataRes;
                setUser(userData);

                const currentRole = userData.roleId || (userData as any).roleId || '';

                setFormData({
                    username: userData.username,
                    email: userData.email,
                    enabled: userData.enabled,
                    accountNonLocked: userData.accountNonLocked,
                    roleId: currentRole,
                });
            } catch (err: any) {
                console.error('Failed to load user', err);
                router.push('/masters/user');
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
            router.push('/masters/user');
        } catch (err: any) {
            console.error('Failed to update user', err);
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

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.roleId}
                            onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
