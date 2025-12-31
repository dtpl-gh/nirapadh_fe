import axios from 'axios';
import { QuestionResponse, CreateQuestionRequest, UpdateQuestionRequest, QuestionIndustryResponse, CreateQuestionIndustryRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

export const fetchQuestions = async (): Promise<QuestionResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/questions`);
    return response.data;
};

export const fetchQuestionById = async (id: string): Promise<QuestionResponse> => {
    const response = await axios.get(`${API_BASE_URL}/questions/${id}`);
    return response.data;
};

export const createQuestion = async (data: CreateQuestionRequest): Promise<QuestionResponse> => {
    const response = await axios.post(`${API_BASE_URL}/questions`, data);
    return response.data;
};

export const updateQuestion = async (id: string, data: UpdateQuestionRequest): Promise<QuestionResponse> => {
    const response = await axios.put(`${API_BASE_URL}/questions/${id}`, data);
    return response.data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/questions/${id}`);
};

export const fetchQuestionIndustries = async (questionId: string): Promise<QuestionIndustryResponse[]> => {
    const response = await axios.get(`${API_BASE_URL}/question-industries/by-question/${questionId}`);
    return response.data;
};

export const createQuestionIndustry = async (data: CreateQuestionIndustryRequest): Promise<QuestionIndustryResponse> => {
    const response = await axios.post(`${API_BASE_URL}/question-industries`, data);
    return response.data;
};

export const deleteQuestionIndustry = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/question-industries/${id}`);
};
