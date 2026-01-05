export interface QuestionResponse {
    id: string;
    questionText: string;
    functionId: string;
    functionName: string;
    status: boolean;
    createdAt: string;
    lastUpdatedAt: string;
    industries?: { id: string; industryName: string }[];
}

export interface CreateQuestionRequest {
    questionText: string;
    functionId: string;
    status: boolean;
}

export interface UpdateQuestionRequest {
    questionText?: string;
    functionId?: string;
    status?: boolean;
}

export interface QuestionIndustryResponse {
    id: string;
    question_id: string;
    industry_id: string;
    status: boolean;
    created_at: string;
    last_updated_at: string;
}

export interface CreateQuestionIndustryRequest {
    question_id: string;
    industry_id: string;
    status: boolean;
}
