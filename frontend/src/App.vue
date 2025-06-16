<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const menuItems = ref([
  {
    label: 'Главная',
    icon: 'pi pi-home',
    command: () => {
      console.log('Navigating to Home');
      router.push('/');
    }
  },
  {
    label: 'Клиенты',
    icon: 'pi pi-users',
    command: () => {
      console.log('Navigating to Clients');
      router.push('/clients');
    }
  },
]);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  console.log('App mounted');
  authStore.initializeAuth();
  console.log('Is authenticated:', authStore.isAuthenticated);
  console.log('Current route:', route.path);
});
</script>

<template>
  <div class="app-container">
    <template v-if="authStore.isAuthenticated">
      <Menubar class="menubar">
        <template #start>
          <span class="text-xl font-bold">Система учёта</span>
        </template>
        <template #end>
          <Button 
            icon="pi pi-power-off" 
            @click="handleLogout" 
            class="p-button-text"
            tooltip="Выйти"
          />
        </template>
      </Menubar>

      <div class="layout-container">
        <div class="sidebar">
          <Menu :model="menuItems" />
        </div>
        <main class="main-content">
          <router-view></router-view>
        </main>
      </div>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
}

.menubar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.5rem 1rem;
}

.layout-container {
  display: flex;
  min-height: 100vh;
  padding-top: 4rem;
}

.sidebar {
  width: 250px;
  background-color: var(--surface-0);
  border-right: 1px solid var(--surface-200);
  padding: 1rem;
  height: calc(100vh - 4rem);
  position: fixed;
  left: 0;
}

.main-content {
  flex: 1;
  background-color: var(--surface-50);
  margin-left: 250px;
  padding: 1rem;
}
</style>
