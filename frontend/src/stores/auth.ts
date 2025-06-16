import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  email: string;
}

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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuthHeader() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        console.log('Auth header set:', axios.defaults.headers.common['Authorization']);
      } else {
        delete axios.defaults.headers.common['Authorization'];
        console.log('Auth header removed');
      }
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.setAuthHeader();
        console.log('Auth initialized with token');
      }
    },

    async register(email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          email,
          password,
        });
        
        const { id, email: userEmail } = response.data;
        
        // После успешной регистрации выполняем вход
        await this.login(email, password);
        
        return { id, email: userEmail };
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.response?.status === 409) {
          throw new Error('Пользователь с таким email уже существует');
        } else if (apiError.response?.data?.error) {
          throw new Error(apiError.response.data.error);
        } else if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Произошла ошибка при регистрации');
        }
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email,
          password,
        });
        
        const { token, user } = response.data;
        
        if (!token) {
          throw new Error('Токен не получен от сервера');
        }
        
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        this.setAuthHeader();
        
        console.log('Login successful, token set');
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.response?.status === 401) {
          throw new Error('Неверный email или пароль');
        } else if (apiError.response?.data?.error) {
          throw new Error(apiError.response.data.error);
        } else if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Произошла ошибка при входе');
        }
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      console.log('Logout completed, auth header removed');
    },
  },
}); 