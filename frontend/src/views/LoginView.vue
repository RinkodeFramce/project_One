<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Вход в систему</h2>
      <form @submit.prevent="handleLogin" class="p-fluid">
        <div class="field">
          <label for="email">Email</label>
          <InputText 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="p-inputtext-lg"
            placeholder="Введите email"
          />
        </div>
        <div class="field">
          <label for="password">Пароль</label>
          <Password 
            id="password" 
            v-model="password" 
            required
            :feedback="false"
            toggleMask
            placeholder="Введите пароль"
          />
        </div>
        <Button 
          type="submit" 
          label="Войти" 
          class="p-button-primary"
          :loading="loading"
        />
        <div class="mt-3 text-center">
          <router-link to="/register" class="text-primary">Нет аккаунта? Зарегистрироваться</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  try {
    loading.value = true;
    await authStore.login(email.value, password.value);
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Вы успешно вошли в систему',
      life: 3000
    });
    router.push('/');
  } catch (error: any) {
    console.error('Ошибка входа:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.message || 'Произошла ошибка при входе',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.field {
  margin-bottom: 1.5rem;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}
</style> 