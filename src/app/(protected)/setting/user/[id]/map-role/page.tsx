"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchUserById } from "../../lib/api";
import { fetchRoles } from "@/app/(protected)/setting/role/lib/api";
import { RoleResponse } from "@/app/(protected)/setting/role/lib/types";
import {
    fetchUserRoles,
    createUserRole,
    deleteUserRole
} from "../../lib/api";

interface MapRolePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MapRolePage({ params }: MapRolePageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [initialRoleIds, setInitialRoleIds] = useState<string[]>([]);
    const [userName, setUserName] = useState("");

    const userId = React.use(params).id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [user, rolesData, userRolesData] = await Promise.all([
                    fetchUserById(userId),
                    fetchRoles(),
                    fetchUserRoles(userId),
                ]);

                const roleList = Array.isArray(rolesData) ? rolesData : (rolesData as any).data || [];
                setRoles(roleList);
                setUserName(user.username);

                // Process existing user roles
                const selectedIds: string[] = [];
                const userRoleList = Array.isArray(userRolesData) ? userRolesData : (userRolesData as any).data || [];

                userRoleList.forEach((userRole: any) => {
                    // API might return userId/roleId in camelCase now
                    if (userRole.roleId) {
                        selectedIds.push(userRole.roleId);
                    }
                });

                setInitialRoleIds(selectedIds);
                setSelectedRoleIds(selectedIds);
            } catch (err) {
                console.error("Failed to load data", err);
                toast({
                    title: "Error",
                    description: "Failed to load user, roles or mappings.",
                    variant: "destructive",
                });
                router.push("/setting/user");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadData();
        }
    }, [userId, toast, router]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const currentIds = selectedRoleIds;

            // Identify additions
            const toAdd = currentIds.filter(id => !initialRoleIds.includes(id));

            // Identify deletions
            const toRemove = initialRoleIds.filter(id => !currentIds.includes(id));

            // Execute additions
            const addPromises = toAdd.map(roleId =>
                createUserRole({
                    userId,
                    roleId
                })
            );

            // Execute deletions
            const removePromises = toRemove.map(roleId =>
                deleteUserRole(userId, roleId)
            );

            await Promise.all([...addPromises, ...removePromises]);

            toast({
                title: "Success",
                description: "Role mapping updated successfully.",
            });
            router.push("/setting/user");
        } catch (err) {
            console.error("Failed to update mapping", err);
            toast({
                title: "Error",
                description: "Failed to update role mapping.",
                variant: "destructive",
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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Map Roles</h1>
                    <p className="text-gray-500">Select roles for the user.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <Label className="text-base font-semibold">User</Label>
                    <p className="text-muted-foreground mt-1">{userName}</p>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Roles</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md max-h-[60vh] overflow-y-auto">
                        {roles.length > 0 ? (
                            roles.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${item.id}`}
                                        checked={selectedRoleIds.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            const newIds = checked
                                                ? [...selectedRoleIds, item.id]
                                                : selectedRoleIds.filter((id) => id !== item.id);
                                            setSelectedRoleIds(newIds);
                                        }}
                                    />
                                    <Label htmlFor={`role-${item.id}`} className="cursor-pointer font-normal">
                                        {item.name}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground col-span-3">No roles available.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Mapping
                    </Button>
                </div>
            </div>
        </div>
    );
}
