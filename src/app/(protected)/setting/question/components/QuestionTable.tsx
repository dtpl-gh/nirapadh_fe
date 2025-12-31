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
import { Edit, Trash2, MoreHorizontal, Globe, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QuestionResponse } from '../lib/types';
import { Badge } from '@/components/ui/badge';

interface QuestionTableProps {
    questions: QuestionResponse[];
    onDelete: (id: string) => void;
}

const getFunctionBadgeColor = (functionName: string) => {
    if (!functionName) return 'bg-gray-100 text-gray-800 border-gray-200';

    const name = functionName.toLowerCase();
    if (name.includes('identify')) return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    if (name.includes('protect')) return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    if (name.includes('detect')) return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    if (name.includes('respond')) return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
    if (name.includes('recover')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';

    return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
};

export const QuestionTable: React.FC<QuestionTableProps> = ({ questions, onDelete }) => {
    const router = useRouter();

    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    if (!questions || questions.length === 0) {
        return <div className="text-center p-4 text-gray-500">No questions found.</div>;
    }

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
                        <TableHead>Question</TableHead>
                        <TableHead>Cyber Security Function</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell className="font-medium">{question.questionText}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`${getFunctionBadgeColor(question.functionName)}`}>
                                    {question.functionName}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={question.status ? 'secondary' : 'destructive'} className={question.status ? 'bg-green-100 text-green-800' : ''}>
                                    {question.status ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(question.createdAt).toLocaleDateString()}</TableCell>
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
                                        <DropdownMenuItem onClick={() => router.push(`/setting/question/${question.id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push(`/setting/question/${question.id}/map-industry`)}>
                                            <Globe className="mr-2 h-4 w-4" />
                                            Map Industry
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={() => setDeleteId(question.id)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the question.
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
