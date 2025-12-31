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
import { IndustryResponse } from '../lib/types';
import { Badge } from '@/components/ui/badge';

interface IndustryTableProps {
    industries: IndustryResponse[];
    onDelete: (id: string) => void;
}

export const IndustryTable: React.FC<IndustryTableProps> = ({ industries, onDelete }) => {
    const router = useRouter();

    if (!industries || industries.length === 0) {
        return <div className="text-center p-4 text-gray-500">No industries found.</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Industry Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {industries.map((industry) => (
                        <TableRow key={industry.id}>
                            <TableCell className="font-medium">{industry.industryName}</TableCell>
                            <TableCell>
                                <Badge variant={industry.status ? 'secondary' : 'destructive'} className={industry.status ? 'bg-green-100 text-green-800' : ''}>
                                    {industry.status ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(industry.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push(`/setting/industry/${industry.id}`)}
                                    className="mr-2"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this industry?')) {
                                            onDelete(industry.id);
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
