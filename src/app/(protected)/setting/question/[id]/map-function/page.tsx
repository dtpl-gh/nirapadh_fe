"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchQuestionById, updateQuestion } from "../../lib/api";
import { fetchCyberSecurityFunctions } from "@/app/(protected)/master/cyber-security-function/lib/api";
import { CyberSecurityFunctionResponse } from "@/app/(protected)/master/cyber-security-function/lib/types";

interface MapFunctionPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MapFunctionPage({ params }: MapFunctionPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [functions, setFunctions] = useState<CyberSecurityFunctionResponse[]>([]);
    const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>([]);
    const [questionText, setQuestionText] = useState("");

    const questionId = React.use(params).id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [question, functionsData] = await Promise.all([
                    fetchQuestionById(questionId),
                    fetchCyberSecurityFunctions(),
                ]);

                const functionList = Array.isArray(functionsData) ? functionsData : (functionsData as any).data || [];
                setFunctions(functionList);
                setQuestionText(question.questionText);
                setSelectedFunctionIds(question.cyberSecurityFunctionIds || []);
            } catch (err) {
                console.error("Failed to load data", err);
                toast({
                    title: "Error",
                    description: "Failed to load question or functions.",
                    variant: "destructive",
                });
                router.push("/setting/question");
            } finally {
                setLoading(false);
            }
        };

        if (questionId) {
            loadData();
        }
    }, [questionId, toast, router]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateQuestion(questionId, { cyberSecurityFunctionIds: selectedFunctionIds });
            toast({
                title: "Success",
                description: "Function mapping updated successfully.",
            });
            router.push("/setting/question");
        } catch (err) {
            console.error("Failed to update mapping", err);
            toast({
                title: "Error",
                description: "Failed to update function mapping.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Map Cyber Security Functions</h1>
                    <p className="text-gray-500">Select cyber security functions for the question.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <Label className="text-base font-semibold">Question</Label>
                    <p className="text-muted-foreground mt-1">{questionText}</p>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Functions</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md max-h-[60vh] overflow-y-auto">
                        {functions.length > 0 ? (
                            functions.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`function-${item.id}`}
                                        checked={selectedFunctionIds.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            const newIds = checked
                                                ? [...selectedFunctionIds, item.id]
                                                : selectedFunctionIds.filter((id) => id !== item.id);
                                            setSelectedFunctionIds(newIds);
                                        }}
                                    />
                                    <Label htmlFor={`function-${item.id}`} className="cursor-pointer font-normal">
                                        {item.functionName}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground col-span-3">No functions available.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Mapping
                    </Button>
                </div>
            </div>
        </div>
    );
}
