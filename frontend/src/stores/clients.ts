import { defineStore } from 'pinia';
import axios from 'axios';
import type { Client } from '../types/client';
import { useAuthStore } from './auth';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}

export const useClientStore = defineStore('clients', {
  state: () => ({
    clients: [] as Client[],
  }),

  actions: {
    async fetchClients() {
      try {
        const authStore = useAuthStore();
        console.log('Fetching clients...');
        console.log('Auth status:', authStore.isAuthenticated);
        console.log('Current headers:', axios.defaults.headers.common['Authorization']);

        // Проверяем и обновляем токен если нужно
        if (!axios.defaults.headers.common['Authorization'] && authStore.token) {
          console.log('Restoring auth header...');
          axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
        }

        const response = await axios.get('http://localhost:3000/api/clients');
        console.log('Clients response:', response.data);
        this.clients = response.data;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('Error details:', {
          status: apiError.response?.status,
          message: apiError.response?.data?.message || apiError.response?.data?.error,
          headers: axios.defaults.headers.common['Authorization']
        });

        if (apiError.response?.status === 401) {
          throw new Error('Необходима авторизация. Пожалуйста, войдите в систему.');
        } else if (apiError.response?.data?.error) {
          throw new Error(apiError.response.data.error);
        } else if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Ошибка при получении списка клиентов');
        }
      }
    },

    async createClient(inn: string, name: string) {
      try {
        console.log('Creating client:', { inn, name });
        console.log('Current headers:', axios.defaults.headers.common['Authorization']);

        const response = await axios.post('http://localhost:3000/api/clients', {
          inn,
          name,
        });
        
        console.log('Create response:', response.data);
        this.clients.push(response.data);
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('Create error:', {
          status: apiError.response?.status,
          message: apiError.response?.data?.message || apiError.response?.data?.error
        });

        if (apiError.response?.status === 401) {
          throw new Error('Необходима авторизация');
        } else if (apiError.response?.data?.error) {
          throw new Error(apiError.response.data.error);
        } else if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Ошибка при создании клиента');
        }
      }
    },

    async searchClients(query: string) {
      try {
        console.log('Searching clients:', query);
        const response = await axios.get(`http://localhost:3000/api/clients/search?query=${encodeURIComponent(query)}`);
        console.log('Search response:', response.data);
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('Search error:', {
          status: apiError.response?.status,
          message: apiError.response?.data?.message || apiError.response?.data?.error
        });

        if (apiError.response?.status === 401) {
          throw new Error('Необходима авторизация');
        } else if (apiError.response?.data?.error) {
          throw new Error(apiError.response.data.error);
        } else if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Ошибка при поиске клиентов');
        }
      }
    },
  },
}); 