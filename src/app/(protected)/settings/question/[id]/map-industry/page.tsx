"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { useToast } from "@components/ui/use-toast";
import { Checkbox } from "@components/ui/checkbox";
import { fetchQuestionById } from "../../lib/api";
import { fetchIndustries } from "@/app/(protected)/settings/industry/lib/api";
import { IndustryResponse } from "@/app/(protected)/settings/industry/lib/types";
import {
    fetchQuestionIndustries,
    createQuestionIndustry,
    deleteQuestionIndustry
} from "../../lib/api";

interface MapIndustryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MapIndustryPage({ params }: MapIndustryPageProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [industries, setIndustries] = useState<IndustryResponse[]>([]);
    // Map industryId to mappingId (if exists)
    const [existingMappings, setExistingMappings] = useState<Record<string, string>>({});
    const [selectedIndustryIds, setSelectedIndustryIds] = useState<string[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [functionId, setFunctionId] = useState("");

    const questionId = React.use(params).id;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [question, industriesData, mappingsData] = await Promise.all([
                    fetchQuestionById(questionId),
                    fetchIndustries(),
                    fetchQuestionIndustries(questionId),
                ]);

                let industryList: IndustryResponse[] = [];
                if (Array.isArray(industriesData)) {
                    industryList = industriesData;
                } else if (industriesData && (industriesData as any).content) {
                    industryList = (industriesData as any).content;
                }

                setIndustries(industryList);
                setQuestionText(question.questionText);
                setFunctionId(question.functionId);

                // Process mappings
                const mappings: Record<string, string> = {};
                const selectedIds: string[] = [];
                // Handle potential Spring Data structure for mappingsData if needed, but assuming array based on API def
                const mappingList = Array.isArray(mappingsData) ? mappingsData : (mappingsData as any).data || [];

                mappingList.forEach((mapping: any) => {
                    mappings[mapping.industry_id] = mapping.id;
                    selectedIds.push(mapping.industry_id);
                });

                setExistingMappings(mappings);
                setSelectedIndustryIds(selectedIds);
            } catch (err) {
                console.error("Failed to load data", err);
                toast({
                    title: "Error",
                    description: "Failed to load question, industries or mappings.",
                    variant: "destructive",
                });
                router.push("/settings/question");
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
            const initialIds = Object.keys(existingMappings);
            const currentIds = selectedIndustryIds;

            // Identify additions
            const toAdd = currentIds.filter(id => !initialIds.includes(id));

            // Identify deletions
            const toRemove = initialIds.filter(id => !currentIds.includes(id));

            // Execute additions
            const addPromises = toAdd.map(industryId =>
                createQuestionIndustry({
                    question_id: questionId,
                    industry_id: industryId,
                    status: true
                })
            );

            // Execute deletions
            const removePromises = toRemove.map(industryId => {
                const mappingId = existingMappings[industryId];
                if (mappingId) {
                    return deleteQuestionIndustry(mappingId);
                }
                return Promise.resolve();
            });

            await Promise.all([...addPromises, ...removePromises]);

            toast({
                title: "Success",
                description: "Industry mapping updated successfully.",
            });
            router.push("/settings/question");
        } catch (err) {
            console.error("Failed to update mapping", err);
            toast({
                title: "Error",
                description: "Failed to update industry mapping.",
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
                    <h1 className="text-2xl font-bold tracking-tight">Map Industries</h1>
                    <p className="text-gray-500">Select industries for the question.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div>
                    <Label className="text-base font-semibold">Question</Label>
                    <p className="text-muted-foreground mt-1">{questionText}</p>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Industries</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md max-h-[60vh] overflow-y-auto">
                        {industries.length > 0 ? (
                            industries.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`industry-${item.id}`}
                                        checked={selectedIndustryIds.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            const newIds = checked
                                                ? [...selectedIndustryIds, item.id]
                                                : selectedIndustryIds.filter((id) => id !== item.id);
                                            setSelectedIndustryIds(newIds);
                                        }}
                                    />
                                    <Label htmlFor={`industry-${item.id}`} className="cursor-pointer font-normal">
                                        {item.industryName}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground col-span-3">No industries available.</p>
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
