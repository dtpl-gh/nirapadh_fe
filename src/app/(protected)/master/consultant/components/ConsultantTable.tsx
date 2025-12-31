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
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ConsultantResponse } from '../lib/types';
import { Badge } from '@/components/ui/badge';

interface ConsultantTableProps {
    consultants: ConsultantResponse[];
    onDelete: (id: string) => void;
}

export const ConsultantTable: React.FC<ConsultantTableProps> = ({ consultants, onDelete }) => {
    const router = useRouter();

    if (!consultants || consultants.length === 0) {
        return <div className="text-center p-4 text-gray-500">No consultants found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience (Years)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {consultants.map((consultant) => (
                        <TableRow key={consultant.id}>
                            <TableCell className="font-medium">{consultant.consultantCode}</TableCell>
                            <TableCell>{consultant.specialization.replace(/_/g, ' ')}</TableCell>
                            <TableCell>{consultant.experienceYears}</TableCell>
                            <TableCell>
                                <Badge variant={consultant.status ? 'secondary' : 'destructive'} className={consultant.status ? 'bg-green-100 text-green-800' : ''}>
                                    {consultant.status ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(consultant.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/master/consultant/${consultant.id}`)}
                                    className="mr-2"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this consultant?')) {
                                            onDelete(consultant.id);
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
