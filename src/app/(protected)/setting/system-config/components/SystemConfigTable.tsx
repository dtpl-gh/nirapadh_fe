'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SystemConfig } from '../lib/types';

interface SystemConfigTableProps {
    configs: SystemConfig[];
}

export const SystemConfigTable: React.FC<SystemConfigTableProps> = ({ configs }) => {
    const router = useRouter();

    if (!configs || configs.length === 0) {
        return <div className="text-center p-4 text-gray-500">No system configurations found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configs.map((config) => (
                        <TableRow key={config.id}>
                            <TableCell className="font-medium">{config.configKey}</TableCell>
                            <TableCell className="truncate max-w-[200px]" title={typeof config.configValue === 'object' ? JSON.stringify(config.configValue) : String(config.configValue)}>
                                {typeof config.configValue === 'object' ? JSON.stringify(config.configValue) : String(config.configValue)}
                            </TableCell>
                            <TableCell className="text-gray-500">{config.description || '-'}</TableCell>
                            <TableCell>{config.status ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/setting/system-config/${config.id}`)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
