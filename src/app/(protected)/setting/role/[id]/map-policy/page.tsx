"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Plus, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    fetchRoleById,
    fetchQualifiers,
    fetchAclClasses,
    fetchPermissions,
    fetchRolePermissionPolicies,
    createRolePermissionPolicy,
    deleteRolePermissionPolicy
} from "../../lib/api";
import { PermissionQualifierResponse, AclClass, Permission, RolePermissionPolicyResponse } from "../../lib/types";

interface MapPolicyPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MapPolicyPage({ params }: MapPolicyPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [roleName, setRoleName] = useState("");

    // Helper Data
    const [qualifiers, setQualifiers] = useState<PermissionQualifierResponse[]>([]);
    const [aclClasses, setAclClasses] = useState<AclClass[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    // Policy Data
    const [policies, setPolicies] = useState<RolePermissionPolicyResponse[]>([]);

    // New Policy Form
    const [newQualifier, setNewQualifier] = useState<string>("");
    const [newAclClassId, setNewAclClassId] = useState<string>("");
    const [newPermissionId, setNewPermissionId] = useState<string>("");
    const [adding, setAdding] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const roleId = React.use(params).id;

    const loadData = async () => {
        try {
            setLoading(true);
            const [role, qualData, aclData, permData, policyData] = await Promise.all([
                fetchRoleById(roleId),
                fetchQualifiers(),
                fetchAclClasses(),
                fetchPermissions(),
                fetchRolePermissionPolicies(roleId)
            ]);

            setRoleName(role.name);
            setQualifiers(Array.isArray(qualData) ? qualData : (qualData as any).data || []);
            setAclClasses(Array.isArray(aclData) ? aclData : (aclData as any).data || []);
            setPermissions(Array.isArray(permData) ? permData : (permData as any).data || []);
            setPolicies(Array.isArray(policyData) ? policyData : (policyData as any).data || []);

        } catch (err) {
            console.error("Failed to load data", err);
            toast({
                title: "Error",
                description: "Failed to load policy data.",
                variant: "destructive",
            });
            router.push("/setting/role");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (roleId) {
            loadData();
        }
    }, [roleId]);

    const handleAddPolicy = async () => {
        if (!newQualifier || !newAclClassId || !newPermissionId) {
            toast({
                title: "Validation Error",
                description: "Please select Qualifier, ACL Class, and Permission.",
                variant: "destructive"
            });
            return;
        }

        try {
            setAdding(true);
            await createRolePermissionPolicy({
                roleId,
                qualifier: newQualifier,
                aclClassId: newAclClassId,
                permissionId: newPermissionId
            });

            toast({
                title: "Success",
                description: "Policy added successfully."
            });

            // Reset form and reload
            setNewQualifier("");
            setNewAclClassId("");
            setNewPermissionId("");

            // Refresh policies
            const updatedPolicies = await fetchRolePermissionPolicies(roleId);
            setPolicies(Array.isArray(updatedPolicies) ? updatedPolicies : (updatedPolicies as any).data || []);

        } catch (err) {
            console.error("Failed to add policy", err);
            toast({
                title: "Error",
                description: "Failed to add policy.",
                variant: "destructive"
            });
        } finally {
            setAdding(false);
        }
    };

    const handleDeletePolicy = async (policyId: string) => {
        try {
            await deleteRolePermissionPolicy(policyId);
            toast({
                title: "Success",
                description: "Policy deleted successfully."
            });
            setPolicies(policies.filter(p => p.id !== policyId));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete policy", err);
            toast({
                title: "Error",
                description: "Failed to delete policy.",
                variant: "destructive"
            });
        }
    };

    // Helper to get names
    const getAclClassName = (id: number) => aclClasses.find(c => c.id === id)?.className || id;
    const getPermissionName = (id: string) => permissions.find(p => p.id === id)?.name || id;

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Role Permission Policies</h1>
                    <p className="text-gray-500">Manage permission policies for role: <span className="font-semibold text-gray-900">{roleName}</span></p>
                </div>
            </div>

            {/* Add Policy Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Add New Policy</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label>ACL Class</Label>
                        <Select value={newAclClassId} onValueChange={setNewAclClassId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {aclClasses.map(cls => (
                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                        {cls.className}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Qualifier</Label>
                        <Select value={newQualifier} onValueChange={setNewQualifier}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Qualifier" />
                            </SelectTrigger>
                            <SelectContent>
                                {qualifiers.map(q => (
                                    <SelectItem key={q.name} value={q.name}>
                                        {q.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Permission</Label>
                        <Select value={newPermissionId} onValueChange={setNewPermissionId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Permission" />
                            </SelectTrigger>
                            <SelectContent>
                                {permissions.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleAddPolicy} disabled={adding}>
                        {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add Policy
                    </Button>
                </div>
            </div>

            {/* Policies Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ACL Class</TableHead>
                            <TableHead>Qualifier</TableHead>
                            <TableHead>Permission</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {policies.length > 0 ? (
                            policies.map(policy => (
                                <TableRow key={policy.id}>
                                    <TableCell className="font-medium bg-gray-50/50">{getAclClassName(policy.aclClassId)}</TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {policy.qualifier}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPermissionName(policy.permissionId)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onSelect={() => setDeleteId(policy.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No policies defined for this role.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the policy.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteId && handleDeletePolicy(deleteId)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
