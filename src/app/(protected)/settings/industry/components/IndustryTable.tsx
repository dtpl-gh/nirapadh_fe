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
import { Input } from '@/components/ui/input';
import { Edit, Trash2, MoreHorizontal, Plus, Filter, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IndustryResponse } from '../lib/types';
import { Badge } from '@/components/ui/badge';
import { FilterWidget } from '@/app/(protected)/components/FilterWidget';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface IndustryTableProps {
    industries: IndustryResponse[];
    onDelete: (id: string) => void;
    onCreate: () => void;
    filters: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    sort?: { key: string; direction: 'asc' | 'desc' } | null;
    onSortChange: (key: string) => void;
}

export const IndustryTable: React.FC<IndustryTableProps> = ({ industries, onDelete, onCreate, filters, onFilterChange, sort, onSortChange }) => {
    const router = useRouter();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);



    const handleDelete = () => {
        if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        onFilterChange(key, value);
    };

    const renderColumnHeader = (label: string, columnKey: string, filterable = true, sortable = true, inputType: 'text' | 'boolean' = 'text') => {
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center cursor-pointer" onClick={() => sortable && onSortChange(columnKey)}>
                    <span className="mr-1">{label}</span>
                    {sortable && (
                        sort?.key === columnKey ? (
                            sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        ) : (
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        )
                    )}
                </div>
                {filterable && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Filter className={`h-4 w-4 ${filters[columnKey] ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-2">
                            <FilterWidget
                                label={label}
                                currentValue={filters[columnKey] || ''}
                                onApply={(val) => handleFilterChange(columnKey, val)}
                                inputType={inputType}
                            />
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{renderColumnHeader('Industry Name', 'industryName')}</TableHead>
                        <TableHead>{renderColumnHeader('Description', 'description')}</TableHead>
                        <TableHead className="text-right">
                            <div className="flex items-center justify-end">
                                <span className="mr-2">Actions</span>
                                <Button onClick={onCreate} size="icon" className="h-6 w-6">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {industries && industries.length > 0 ? (
                        industries.map((industry) => (
                            <TableRow key={industry.id}>
                                <TableCell className="font-medium">{industry.industryName}</TableCell>
                                <TableCell>{industry.description}</TableCell>
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
                                            <DropdownMenuItem onClick={() => router.push(`/settings/industry/${industry.id}`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => setDeleteId(industry.id)}
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
                            <TableCell colSpan={3} className="h-24 text-center">
                                No industries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the industry.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
