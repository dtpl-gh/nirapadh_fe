'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { useToast } from '@components/ui/use-toast';
import { createQuestion } from '../lib/api';
import { Textarea } from '@components/ui/textarea';
import { Switch } from '@components/ui/switch';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { fetchCyberSecurityFunctions } from '@/app/(protected)/masters/cyber-security-function/lib/api';
import { CyberSecurityFunctionResponse } from '@/app/(protected)/masters/cyber-security-function/lib/types';

export default function CreateQuestionPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [functions, setFunctions] = useState<CyberSecurityFunctionResponse[]>([]);

    const [formData, setFormData] = useState({
        questionText: '',
        status: true,
        functionId: '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                const functionsData = await fetchCyberSecurityFunctions();
                // Handle potential response structure (array, data object, or content object)
                let functionList = [];
                if (Array.isArray(functionsData)) {
                    functionList = functionsData;
                } else if ((functionsData as any).data && Array.isArray((functionsData as any).data)) {
                    functionList = (functionsData as any).data;
                } else if ((functionsData as any).content && Array.isArray((functionsData as any).content)) {
                    functionList = (functionsData as any).content;
                }

                console.log('Parsed Function List:', functionList);
                setFunctions(functionList);
            } catch (err: any) {
                console.error('Failed to load functions', err);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await createQuestion(formData);
            toast({
                title: 'Success',
                description: 'Question created successfully.',
            });
            router.back();
        } catch (err: any) {
            console.error('Failed to create question', err);
        } finally {
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }



    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Question</h1>
                    <p className="text-gray-500">Add a new question to the assessment.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="questionText">Question Text</Label>
                        <Textarea
                            id="questionText"
                            value={formData.questionText}
                            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="functionId">Cyber Security Function</Label>
                        <Select
                            value={formData.functionId}
                            onValueChange={(value) => setFormData({ ...formData, functionId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a function" />
                            </SelectTrigger>
                            <SelectContent>
                                {functions.length > 0 ? (
                                    functions.map((func) => (
                                        <SelectItem key={func.id} value={func.id}>
                                            {func.functionName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>
                                        No functions available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="status"
                            checked={formData.status}
                            onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                        />
                        <Label htmlFor="status">Active</Label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Question
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
