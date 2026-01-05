import axiosInstance from '@/lib/axios';
import { QuestionResponse, CreateQuestionRequest, UpdateQuestionRequest, QuestionIndustryResponse, CreateQuestionIndustryRequest } from './types';
import { PageRequest, PaginatedResponse } from '@/lib/pagination';

export const fetchQuestions = async (params?: PageRequest): Promise<PaginatedResponse<QuestionResponse>> => {
    // Map questionText filter to search
    let searchTerm = params?.search;
    if (params?.filters?.questionText) {
        searchTerm = params.filters.questionText as string;
    }

    const queryParams: any = {
        page: params?.page,
        size: params?.size,
        search: searchTerm,
        sort: params?.sort,
    };

    if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'questionText') {
                queryParams[key] = value;
            }
        });
    }

    const response = await axiosInstance.get(`/questions`, {
        params: queryParams,
    });
    return response.data;
};

export const fetchQuestionById = async (id: string): Promise<QuestionResponse> => {
    const response = await axiosInstance.get(`/questions/${id}`);
    return response.data;
};

export const createQuestion = async (data: CreateQuestionRequest): Promise<QuestionResponse> => {
    const response = await axiosInstance.post(`/questions`, data);
    return response.data;
};

export const updateQuestion = async (id: string, data: UpdateQuestionRequest): Promise<QuestionResponse> => {
    const response = await axiosInstance.put(`/questions/${id}`, data);
    return response.data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/questions/${id}`);
};

export const fetchQuestionIndustries = async (questionId: string): Promise<QuestionIndustryResponse[]> => {
    const response = await axiosInstance.get(`/question-industries/by-question/${questionId}`);
    return response.data;
};

export const createQuestionIndustry = async (data: CreateQuestionIndustryRequest): Promise<QuestionIndustryResponse> => {
    const response = await axiosInstance.post(`/question-industries`, data);
    return response.data;
};

export const deleteQuestionIndustry = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/question-industries/${id}`);
};
