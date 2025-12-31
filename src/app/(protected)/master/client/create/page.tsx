'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createClient, fetchUnassignedClients } from '../lib/api';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserResponse } from '../lib/types';
import { fetchIndustries } from '../../../setting/industry/lib/api';
import { IndustryResponse } from '../../../setting/industry/lib/types';

export default function CreateClientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        pan: '',
        gst: '',
        phone: '',
        email: '',
        pocName: '',
        pocEmail: '',
        pocMobile: '',
        businessName: '',
        numberOfLocations: 0,
        numberOfEmployees: 0,
        numberOfSuppliers: 0,
        numberOfExternalPartners: 0,
        industryId: '',
        userId: '',
        status: true,
    });
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [industries, setIndustries] = useState<IndustryResponse[]>([]);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const [usersData, industriesData] = await Promise.all([
                    fetchUnassignedClients(),
                    fetchIndustries(),
                ]);
                setUsers(usersData);
                setIndustries(industriesData);
            } catch (err) {
                console.error('Failed to load data', err);
                toast({
                    title: 'Error',
                    description: 'Failed to load initial data.',
                    variant: 'destructive',
                });
            }
        };
        loadData();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await createClient(formData);
            toast({
                title: 'Success',
                description: 'Client created successfully.',
            });
            router.push('/master/client');
        } catch (err) {
            console.error('Failed to create client', err);
            toast({
                title: 'Error',
                description: 'Failed to create client.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Client</h1>
                    <p className="text-gray-500">Add a new client.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                                id="businessName"
                                value={formData.businessName}
                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pan">PAN</Label>
                            <Input
                                id="pan"
                                value={formData.pan}
                                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gst">GST</Label>
                            <Input
                                id="gst"
                                value={formData.gst}
                                onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pocName">POC Name</Label>
                            <Input
                                id="pocName"
                                value={formData.pocName}
                                onChange={(e) => setFormData({ ...formData, pocName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pocEmail">POC Email</Label>
                            <Input
                                id="pocEmail"
                                type="email"
                                value={formData.pocEmail}
                                onChange={(e) => setFormData({ ...formData, pocEmail: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pocMobile">POC Mobile</Label>
                            <Input
                                id="pocMobile"
                                value={formData.pocMobile}
                                onChange={(e) => setFormData({ ...formData, pocMobile: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfLocations">Number of Locations</Label>
                            <Input
                                id="numberOfLocations"
                                type="number"
                                min="0"
                                value={formData.numberOfLocations}
                                onChange={(e) => setFormData({ ...formData, numberOfLocations: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                            <Input
                                id="numberOfEmployees"
                                type="number"
                                min="0"
                                value={formData.numberOfEmployees}
                                onChange={(e) => setFormData({ ...formData, numberOfEmployees: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfSuppliers">Number of Suppliers</Label>
                            <Input
                                id="numberOfSuppliers"
                                type="number"
                                min="0"
                                value={formData.numberOfSuppliers}
                                onChange={(e) => setFormData({ ...formData, numberOfSuppliers: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numberOfExternalPartners">Number of External Partners</Label>
                            <Input
                                id="numberOfExternalPartners"
                                type="number"
                                min="0"
                                value={formData.numberOfExternalPartners}
                                onChange={(e) => setFormData({ ...formData, numberOfExternalPartners: parseInt(e.target.value) || 0 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industryId">Industry</Label>
                            <Select
                                value={formData.industryId}
                                onValueChange={(value) => setFormData({ ...formData, industryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((industry) => (
                                        <SelectItem key={industry.id} value={industry.id}>
                                            {industry.industryName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                            Create Client
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
