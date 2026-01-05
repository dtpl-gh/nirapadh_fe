'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@components/ui/table';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Edit, Filter, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SystemConfig } from '../lib/types';
import { Badge } from '@components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@components/ui/popover';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';

interface SystemConfigTableProps {
    configs: SystemConfig[];
    filters: Record<string, any>;
    onFilterChange: (key: string, value: any) => void;
    sort?: { key: string; direction: 'asc' | 'desc' } | null;
    onSortChange: (key: string) => void;
}

import { FilterWidget } from '@/app/(protected)/components/FilterWidget';

export const SystemConfigTable: React.FC<SystemConfigTableProps> = ({ configs, filters, onFilterChange, sort, onSortChange }) => {
    const router = useRouter();

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
                        <TableHead>{renderColumnHeader('Config Key', 'configKey')}</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>{renderColumnHeader('Description', 'description')}</TableHead>
                        <TableHead>{renderColumnHeader('Status', 'status', true, true, 'boolean')}</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(!configs || configs.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No system configurations found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        configs.map((config) => (
                            <TableRow key={config.id}>
                                <TableCell className="font-medium">{config.configKey}</TableCell>
                                <TableCell className="truncate max-w-[200px]" title={typeof config.configValue === 'object' ? JSON.stringify(config.configValue) : String(config.configValue)}>
                                    {typeof config.configValue === 'object' ? JSON.stringify(config.configValue) : String(config.configValue)}
                                </TableCell>
                                <TableCell className="text-gray-500">{config.description || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={config.status ? 'secondary' : 'destructive'} className={config.status ? 'bg-green-100 text-green-800' : ''}>
                                        {config.status ? 'Active' : 'Inactive'}
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
                                            <DropdownMenuItem onClick={() => router.push(`/settings/system-config/${config.id}`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    );
};
