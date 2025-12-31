'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createConsultant, fetchUnassignedConsultants } from '../lib/api';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserResponse, ConsultantSpecialization } from '../lib/types';

export default function CreateConsultantPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        consultantCode: '',
        specialization: '',
        experienceYears: 0,
        status: true,
    });
    const [users, setUsers] = useState<UserResponse[]>([]);

    React.useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUnassignedConsultants();
                setUsers(data);
            } catch (err) {
                console.error('Failed to load users', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load unassigned consultants.',
                    variant: 'destructive',
                });
            }
        };
        loadUsers();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await createConsultant(formData);
            toast({
                title: 'Success',
                description: 'Consultant created successfully.',
            });
            router.push('/master/consultant');
        } catch (err) {
            console.error('Failed to create consultant', err);
            toast({
                title: 'Error',
                description: 'Failed to create consultant.',
                variant: 'destructive',
            });
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
                    <h1 className="text-2xl font-bold tracking-tight">Create Consultant</h1>
                    <p className="text-gray-500">Add a new consultant.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User</Label>
                            <Select
                                value={formData.userId}
                                onValueChange={(value) => setFormData({ ...formData, userId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            Create Consultant
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
