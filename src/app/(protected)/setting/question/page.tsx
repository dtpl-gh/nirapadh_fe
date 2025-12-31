'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionResponse } from './lib/types';
import { fetchQuestions, deleteQuestion } from './lib/api';
import { QuestionTable } from './components/QuestionTable';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const QuestionPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const data = await fetchQuestions();
            // Handle potential response structure differences
            const questionList = Array.isArray(data) ? data : (data as any).data || [];
            setQuestions(questionList);
        } catch (err) {
            console.error('Failed to fetch questions', err);
            toast({
                title: 'Error',
                description: 'Failed to load questions.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, [toast]);

    const handleDelete = async (id: string) => {
        try {
            await deleteQuestion(id);
            toast({
                title: 'Success',
                description: 'Question deleted successfully.',
            });
            loadQuestions(); // Refresh list
        } catch (err) {
            console.error('Failed to delete question', err);
            toast({
                title: 'Error',
                description: 'Failed to delete question.',
                variant: 'destructive',
            });
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
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Question Management</h1>
                    <p className="text-gray-500 mt-1">Manage assessment questions.</p>
                </div>
                <Button onClick={() => router.push('/setting/question/create')} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <QuestionTable questions={questions} onDelete={handleDelete} />
        </div>
    );
};

export default QuestionPage;
