import apiClient from './client';

export interface NewsItem {
  filename: string;
  title: string;
  date: string;
  html: string;
}

export const newsApi = {
  getAll: async (): Promise<NewsItem[]> => {
    const response = await apiClient.get<NewsItem[]>('/news');
    return response.data;
  },
};