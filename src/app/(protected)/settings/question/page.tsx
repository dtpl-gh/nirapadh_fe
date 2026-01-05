'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionResponse } from './lib/types';
import { fetchQuestions, deleteQuestion, fetchQuestionIndustries } from './lib/api';
import { fetchIndustries } from '@/app/(protected)/settings/industry/lib/api';
import { QuestionTable } from './components/QuestionTable';
import { Loader2 } from 'lucide-react';
import { useToast } from '@components/ui/use-toast';
import { Pagination } from '@components/ui/pagination';

const QuestionPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const loadQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const sortParam = sort ? [`${sort.key},${sort.direction}`] : undefined;

            // Fetch questions and all industries in parallel
            const [questionsData, allIndustriesData] = await Promise.all([
                fetchQuestions({ page, size, search, filters, sort: sortParam }),
                fetchIndustries({ page: 0, size: 1000 })
            ]);

            const allIndustries = Array.isArray(allIndustriesData) ? allIndustriesData : (allIndustriesData as any)?.content || [];
            const industryMap = new Map(allIndustries.map((ind: any) => [ind.id, ind.industryName]));

            const questionsList = questionsData?.content || [];

            // Fetch mappings for each question
            const questionsWithIndustries = await Promise.all(
                questionsList.map(async (question: any) => {
                    try {
                        const mappings = await fetchQuestionIndustries(question.id);
                        const mappedIndustries = (mappings || []).map((m: any) => ({
                            id: m.industry_id,
                            industryName: industryMap.get(m.industry_id) || 'Unknown Industry'
                        }));

                        return { ...question, industries: mappedIndustries };
                    } catch (err) {
                        console.error(`Failed to fetch industries for question ${question.id}`, err);
                        return { ...question, industries: [] };
                    }
                })
            );

            setQuestions(questionsWithIndustries);
            setTotalPages(questionsData?.totalPages || 0);
        } catch (err: any) {
            console.error('Failed to fetch questions', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, search, filters, sort, toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadQuestions();
        }, 300);
        return () => clearTimeout(timer);
    }, [loadQuestions]);

    const handleDelete = async (id: string) => {
        try {
            await deleteQuestion(id);
            toast({
                title: 'Success',
                description: 'Question deleted successfully.',
            });
            loadQuestions(); // Refresh list
        } catch (err: any) {
            console.error('Failed to delete question', err);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const handleSortChange = (key: string) => {
        setSort(current => {
            if (current?.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                return null; // Reset sort
            }
            return { key, direction: 'asc' };
        });
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


            <QuestionTable
                questions={questions}
                onDelete={handleDelete}
                filters={filters}
                onFilterChange={handleFilterChange}
                sort={sort}
                onSortChange={handleSortChange}
                onCreate={() => router.push('/settings/question/create')}
            />
            <div className="flex justify-end mt-4">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
};

export default QuestionPage;
