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
import { Edit, Trash2, MoreHorizontal, Shield, Filter, ArrowUpDown, ArrowUp, ArrowDown, KeyRound, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppUser } from '../lib/types';
import { Badge } from '@/components/ui/badge';
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

interface UserTableProps {
    users: AppUser[];
    onDelete: (id: string) => void;
    filters: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    sort?: { key: string; direction: 'asc' | 'desc' } | null;
    onSortChange: (key: string) => void;
    onCreate: () => void;
}

import { FilterWidget } from '@/app/(protected)/components/FilterWidget';

export const UserTable: React.FC<UserTableProps> = ({ users, onDelete, filters, onFilterChange, sort, onSortChange, onCreate }) => {
    const router = useRouter();

    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const handleFilterChange = (key: string, value: string) => {
        onFilterChange(key, value);
    };

    const renderColumnHeader = (label: string, columnKey: string, filterable = true, sortable = true) => {
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
                            />
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{renderColumnHeader('Username', 'username')}</TableHead>
                        <TableHead>{renderColumnHeader('Email', 'email')}</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Account</TableHead>
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
                    {(!users || users.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleName || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={user.enabled ? 'secondary' : 'destructive'} className={user.enabled ? 'bg-green-100 text-green-800' : ''}>
                                        {user.enabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={user.accountNonLocked ? 'text-gray-600' : 'text-red-600 border-red-200'}>
                                        {user.accountNonLocked ? 'Unlocked' : 'Locked'}
                                    </Badge>
                                </TableCell>
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
                                            <DropdownMenuItem onClick={() => router.push(`/masters/user/${user.id}`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => setDeleteId(user.id)}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user.
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
