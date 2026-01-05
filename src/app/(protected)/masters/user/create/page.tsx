'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createUser } from '../lib/api';
import { EmailInput } from '@/components/ui/email-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchRoles } from '@/app/(protected)/settings/role/lib/api';
import { RoleResponse } from '@/app/(protected)/settings/role/lib/types';


export default function CreateUserPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        roleId: '',
    });

    useEffect(() => {
        const loadRoles = async () => {
            try {
                // Fetch first 100 roles to populate the dropdown
                const response = await fetchRoles({ size: 100 });
                setRoles(response.content);
            } catch (err: any) {
                console.error('Failed to fetch roles', err);
            }
        };
        loadRoles();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.roleId) {
            toast({
                title: 'Error',
                description: 'Please select a role.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setSaving(true);
            await createUser(formData);
            toast({
                title: 'Success',
                description: 'User created successfully.',
            });
            router.back();
        } catch (err: any) {
            console.error('Failed to create user', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create User</h1>
                    <p className="text-gray-500">Add a new user to the system.</p>
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

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
