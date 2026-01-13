<script setup lang="ts">
import { computed } from 'vue';
import type { FormField } from './types';
import { cleanFormContent } from './utils';

const props = defineProps<{ content: unknown }>();
const emit = defineEmits(['update:content']);

// Ensure content is valid
const mappedContent = computed({
  get: () => cleanFormContent(props.content || {}),
  set: (newVal) => emit('update:content', newVal)
});

const addNewField = () => {
  const newField: FormField = {
    id: `f_${Date.now()}`,
    label: 'New Question',
    name: `field_${Date.now()}`,
    type: 'text',
    required: false,
    width: '100%'
  };
  
  // Push to the array
  mappedContent.value.fields.push(newField);
};

const removeField = (index: number) => {
  mappedContent.value.fields.splice(index, 1);
};
</script>

<template>
  <div class="p-4 bg-white">
    <div class="mb-6 border-b pb-4">
      <h3 class="font-bold text-lg mb-2">General Settings</h3>
      
      <label class="block mb-2 text-sm font-medium">Form Title</label>
      <input 
        v-model="mappedContent.title" 
        type="text" 
        class="w-full p-2 border rounded mb-2"
      />

      <label class="block mb-2 text-sm font-medium">Button Label</label>
      <input 
        v-model="mappedContent.submitButtonLabel" 
        type="text" 
        class="w-full p-2 border rounded"
      />
    </div>

    <div class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">Form Fields</h3>
        <button 
          @click="addNewField"
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          + Add Field
        </button>
      </div>

      <div v-if="mappedContent.fields.length === 0" class="text-gray-500 italic text-center py-4">
        No fields added yet. Click above to add one.
      </div>

      <div 
        v-for="(field, index) in mappedContent.fields" 
        :key="field.id"
        class="border rounded p-3 mb-3 bg-gray-50 relative group"
      >
        <button 
          @click="removeField(index)"
          class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
          title="Remove Field"
        >
          ✕
        </button>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-600">Label</label>
            <input v-model="field.label" class="w-full p-1 border rounded text-sm" placeholder="e.g. Your Name" />
          </div>

          <div>
            <label class="text-xs text-gray-600">Type</label>
            <select v-model="field.type" class="w-full p-1 border rounded text-sm">
              <option value="text">Text Input</option>
              <option value="email">Email</option>
              <option value="textarea">Text Area (Long)</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          <div class="flex items-center mt-2">
            <input type="checkbox" v-model="field.required" :id="`req-${field.id}`" class="mr-2" />
            <label :for="`req-${field.id}`" class="text-sm">Is Required?</label>
          </div>
          
          <div class="mt-2">
             <label class="text-xs text-gray-600">Width</label>
             <select v-model="field.width" class="w-full p-1 border rounded text-sm">
               <option value="100%">Full Row</option>
               <option value="50%">Half Row</option>
             </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomFormForm'
}
</script>

