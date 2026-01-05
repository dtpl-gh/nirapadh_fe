'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { fetchConsultantById, updateConsultant, fetchUnassignedConsultants } from '../lib/api';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserResponse, ConsultantSpecialization } from '../lib/types';
import { fetchUserById } from '../../user/lib/api';
import { AppUser } from '../../user/lib/types';
import Link from "next/link";

interface EditConsultantPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditConsultantPage({ params }: EditConsultantPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        consultantCode: '',
        specialization: '',
        experienceYears: 0,
        status: true,
    });
    const [users, setUsers] = useState<(UserResponse | AppUser)[]>([]);

    const consultantId = React.use(params).id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [consultant, unassignedUsers] = await Promise.all([
                    fetchConsultantById(consultantId),
                    fetchUnassignedConsultants(),
                ]);

                let allUsers: (UserResponse | AppUser)[] = [...unassignedUsers];

                // If consultant has a user assigned, fetch that user's details if not already in list
                if (consultant.userId) {
                    const existingUser = unassignedUsers.find((u: any) => u.id === consultant.userId);
                    if (!existingUser) {
                        try {
                            const currentUser = await fetchUserById(consultant.userId);
                            allUsers = [currentUser, ...allUsers];
                        } catch (e) {
                            console.error('Failed to fetch current user details', e);
                            // If we can't fetch details, we might still want to add a placeholder or rely on ID
                            // For now, we accept it might be missing in dropdown text
                        }
                    }
                }

                setUsers(allUsers);
                setFormData({
                    userId: consultant.userId,
                    consultantCode: consultant.consultantCode,
                    specialization: consultant.specialization,
                    experienceYears: consultant.experienceYears,
                    status: consultant.status,
                });
            } catch (err: any) {
                console.error('Failed to fetch data', err);
                router.push('/masters/consultant');
            } finally {
                setLoading(false);
            }
        };

        if (consultantId) {
            loadData();
        }
    }, [consultantId, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateConsultant(consultantId, formData);
            toast({
                title: 'Success',
                description: 'Consultant updated successfully.',
            });
            router.push('/masters/consultant');
        } catch (err: any) {
            console.error('Failed to update consultant', err);
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
                    <h1 className="text-2xl font-bold tracking-tight">Edit Consultant</h1>
                    <p className="text-gray-500">Update consultant information.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User</Label>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={formData.userId}
                                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => {
                                            const label = (user as any).firstName
                                                ? `${(user as any).firstName} ${(user as any).lastName} (${user.email})`
                                                : `${(user as any).username} (${user.email})`;
                                            return (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {label}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="default"
                                    size="icon"
                                    asChild
                                    type="button"
                                >
                                    <Link href={`/masters/user/${formData.userId}`}>
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="consultantCode">Consultant Code</Label>
                            <Input
                                id="consultantCode"
                                value={formData.consultantCode}
                                onChange={(e) => setFormData({ ...formData, consultantCode: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Select
                                value={formData.specialization}
                                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Specialization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ConsultantSpecialization).map((spec) => (
                                        <SelectItem key={spec} value={spec}>
                                            {spec.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experienceYears">Experience (Years)</Label>
                            <Input
                                id="experienceYears"
                                type="number"
                                min="0"
                                value={formData.experienceYears}
                                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>
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
                            Update Consultant
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
