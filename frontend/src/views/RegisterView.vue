<template>
  <div class="register-container">
    <Toast position="top-right" />
    <div class="register-card">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleRegister" class="p-fluid">
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
            :feedback="true"
            toggleMask
            placeholder="Введите пароль"
          />
        </div>
        <div class="field">
          <label for="confirmPassword">Подтверждение пароля</label>
          <Password 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            :feedback="false"
            toggleMask
            placeholder="Повторите пароль"
          />
        </div>
        <Button 
          type="submit" 
          label="Зарегистрироваться" 
          class="p-button-primary"
          :loading="loading"
        />
        <div class="mt-3 text-center">
          <router-link to="/login" class="text-primary">Уже есть аккаунт? Войти</router-link>
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
const confirmPassword = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Пароли не совпадают',
      life: 3000
    });
    return;
  }

  try {
    loading.value = true;
    await authStore.register(email.value, password.value);
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Регистрация выполнена успешно',
      life: 3000
    });
    router.push('/');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Произошла ошибка при регистрации',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-card {
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