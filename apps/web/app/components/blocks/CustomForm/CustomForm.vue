<template>
  <div class="custom-form-block py-10 px-4 max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold mb-2">{{ mappedContent.title }}</h2>
      <p v-if="mappedContent.description" class="text-gray-600">{{ mappedContent.description }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex flex-wrap -mx-2">
        
        <div 
          v-for="field in mappedContent.fields" 
          :key="field.id"
          class="px-2 mb-4"
          :class="field.width === '50%' ? 'w-full md:w-1/2' : 'w-full'"
        >
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <textarea
            v-if="field.type === 'textarea'"
            :name="field.name"
            :required="field.required"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
          ></textarea>

          <div v-else-if="field.type === 'checkbox'" class="flex items-center mt-2">
            <input 
              type="checkbox" 
              :name="field.name" 
              :required="field.required"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-600">Yes, I agree</span>
          </div>

          <input
            v-else
            :type="field.type"
            :name="field.name"
            :required="field.required"
            class="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>

      <div class="mt-6 text-center">
        <button 
          type="submit" 
          class="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium"
        >
          {{ mappedContent.submitButtonLabel }}
        </button>
      </div>
      
      <div v-if="isSuccess" class="mt-4 p-4 bg-green-50 text-green-700 rounded text-center">
        {{ mappedContent.successMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CustomFormProps } from './types';
import { cleanFormContent } from './utils';

const props = defineProps<{ content: any }>();
const mappedContent = computed(() => cleanFormContent(props.content || {}));
const isSuccess = ref(false);

const handleSubmit = () => {
  // Logic to send data to backend would go here
  console.log("Form Submitted");
  isSuccess.value = true;
  setTimeout(() => { isSuccess.value = false }, 5000);
};
</script>