<template>
  <div class="clients-container">
    <Toast position="top-right" />
    
    <div class="header">
      <h1>Клиенты</h1>
      <Button 
        label="Добавить клиента" 
        icon="pi pi-plus" 
        @click="openNewClientDialog"
        class="p-button-success"
      />
    </div>
    
    <div class="p-d-flex p-jc-between p-mb-4">
      <span class="p-input-icon-left search-container">
        <i class="pi pi-search" />
        <InputText 
          v-model="searchQuery" 
          placeholder="Поиск по ИНН или названию" 
          class="p-inputtext-lg"
        />
      </span>
    </div>

    <DataTable
      :value="filteredClients"
      :paginator="true"
      :rows="10"
      :loading="loading"
      sortMode="multiple"
      v-model:filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['inn', 'name']"
      responsiveLayout="scroll"
      @row-click="openClientDetails"
      class="p-datatable-lg"
      :emptyMessage="'Нет данных для отображения'"
    >
      <Column field="inn" header="ИНН" sortable />
      <Column field="name" header="Наименование" sortable />
    </DataTable>

    <Dialog
      v-model:visible="displayModal"
      :header="selectedClient?.name || 'Детали клиента'"
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div v-if="selectedClient" class="p-fluid">
        <div class="field">
          <label>ИНН</label>
          <div class="p-text-bold">{{ selectedClient.inn }}</div>
        </div>
        <div class="field">
          <label>Наименование</label>
          <div class="p-text-bold">{{ selectedClient.name }}</div>
        </div>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="displayNewClientModal"
      header="Новый клиент"
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div class="p-fluid">
        <div class="field">
          <label for="inn">ИНН</label>
          <InputText 
            id="inn"
            v-model="newClient.inn" 
            required 
            :class="{'p-invalid': v$.newClient.inn.$invalid && v$.newClient.inn.$dirty}"
          />
          <small class="p-error" v-if="v$.newClient.inn.$error">
            ИНН обязателен и должен содержать 10 или 12 цифр
          </small>
        </div>
        <div class="field">
          <label for="name">Наименование</label>
          <InputText 
            id="name"
            v-model="newClient.name" 
            required
            :class="{'p-invalid': v$.newClient.name.$invalid && v$.newClient.name.$dirty}"
          />
          <small class="p-error" v-if="v$.newClient.name.$error">
            Наименование обязательно
          </small>
        </div>
      </div>
      <template #footer>
        <Button 
          label="Отмена" 
          icon="pi pi-times" 
          @click="closeNewClientDialog" 
          class="p-button-text"
        />
        <Button 
          label="Сохранить" 
          icon="pi pi-check" 
          @click="saveNewClient" 
          :loading="saving"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useClientStore } from '../stores/clients';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, numeric } from '@vuelidate/validators';
import type { Client } from '../types/client';
import { useRoute } from 'vue-router';

const route = useRoute();
const clientStore = useClientStore();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);
const saving = ref(false);
const searchQuery = ref('');
const displayModal = ref(false);
const displayNewClientModal = ref(false);
const selectedClient = ref<Client | null>(null);
const filters = ref({});

const newClient = ref({
  inn: '',
  name: '',
});

const rules = {
  newClient: {
    inn: { 
      required, 
      numeric,
      validLength: (value: string) => value.length === 10 || value.length === 12 
    },
    name: { required, minLength: minLength(2) }
  }
};

const v$ = useVuelidate(rules, { newClient });

const filteredClients = computed(() => {
  console.log('Computing filtered clients, total:', clientStore.clients.length);
  if (!searchQuery.value) return clientStore.clients;
  
  const query = searchQuery.value.toLowerCase();
  return clientStore.clients.filter(client => 
    client.inn.toLowerCase().includes(query) ||
    client.name.toLowerCase().includes(query)
  );
});

const openClientDetails = (event: { data: Client }) => {
  selectedClient.value = event.data;
  displayModal.value = true;
};

const openNewClientDialog = () => {
  newClient.value = { inn: '', name: '' };
  v$.value.$reset();
  displayNewClientModal.value = true;
};

const closeNewClientDialog = () => {
  displayNewClientModal.value = false;
  newClient.value = { inn: '', name: '' };
};

const saveNewClient = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  saving.value = true;
  try {
    await clientStore.createClient(newClient.value.inn, newClient.value.name);
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Клиент успешно создан',
      life: 3000
    });
    closeNewClientDialog();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.message || 'Произошла ошибка при создании клиента',
      life: 3000
    });
  } finally {
    saving.value = false;
  }
};

const loadClients = async () => {
  console.log('Loading clients...');
  console.log('Auth status:', authStore.isAuthenticated);
  
  loading.value = true;
  try {
    await clientStore.fetchClients();
    console.log('Clients loaded, count:', clientStore.clients.length);
  } catch (error: any) {
    console.error('Error loading clients:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.message || 'Произошла ошибка при загрузке клиентов',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Следим за изменением маршрута
watch(
  () => route.path,
  (newPath) => {
    console.log('Route changed to:', newPath);
    if (newPath === '/clients') {
      loadClients();
    }
  }
);

onMounted(() => {
  console.log('ClientsView mounted');
  if (route.path === '/clients') {
    loadClients();
  }
});
</script>

<style scoped>
.clients-container {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.search-container .p-inputtext {
  width: 100%;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  color: var(--text-color-secondary);
}

h1 {
  margin: 0;
  color: var(--text-color);
}
</style> 