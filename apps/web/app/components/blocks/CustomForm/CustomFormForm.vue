<template>
  <UiAccordionItem
    v-model="groups.general"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary><h2>General Settings</h2></template>
    
    <div class="mb-4">
      <UiFormLabel>Form Title</UiFormLabel>
      <SfInput v-model="formContent.text.title" placeholder="Contact Us" />
    </div>
    
    <div class="mb-4">
      <UiFormLabel>Description</UiFormLabel>
      <SfTextarea v-model="formContent.text.description" class="min-h-[100px]" />
    </div>

    <div class="mb-4">
      <UiFormLabel>Background Color</UiFormLabel>
      <SfInput type="color" v-model="formContent.text.bgColor" class="h-[50px] w-full cursor-pointer" />
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="groups.fields"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary><h2>Form Fields ({{ formContent.fields.length }})</h2></template>

    <div class="flex flex-col gap-4">
      <div 
        v-for="(field, idx) in formContent.fields" 
        :key="field.id" 
        class="border border-neutral-200 rounded p-3 bg-white"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-sm">Field {{ idx + 1 }}</span>
          <button @click="removeField(idx)" class="text-negative-700 text-xs font-bold uppercase hover:underline">Remove</button>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="text-xs text-neutral-500">Label</label>
            <SfInput v-model="field.label" size="sm" />
          </div>
          <div>
            <label class="text-xs text-neutral-500">Internal Name</label>
            <SfInput v-model="field.name" size="sm" placeholder="e.g. email" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label class="text-xs text-neutral-500">Type</label>
            <select v-model="field.type" class="w-full border rounded px-2 py-1.5 text-sm">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Text Area</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-neutral-500">Width</label>
            <select v-model="field.width" class="w-full border rounded px-2 py-1.5 text-sm">
              <option value="100%">Full Width</option>
              <option value="50%">Half Width</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <label class="flex items-center text-sm cursor-pointer">
            <SfSwitch v-model="field.required" class="mr-2" /> Required
          </label>
        </div>
      </div>

      <UiButton @click="addField" variant="secondary" class="w-full dashed-border">
        + Add New Field
      </UiButton>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="groups.actions"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary><h2>Button & Actions</h2></template>
    
    <div class="mb-4">
      <UiFormLabel>Button Label</UiFormLabel>
      <SfInput v-model="formContent.button.label" placeholder="Send Message" />
    </div>

    <div class="mb-4">
      <UiFormLabel>Success Message</UiFormLabel>
      <SfInput v-model="formContent.settings.successMessage" placeholder="Thanks for contacting us!" />
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch } from '@storefront-ui/vue';
import type { CustomFormContent, FormField } from './types';
import { reactive, computed } from 'vue';

// Manage Accordion State
const groups = reactive({
  general: true,
  fields: true,
  actions: true
});

// Access Builder Data
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

// Initialize or Get Content
const formContent = computed<Required<CustomFormContent>>(() => {
  const uuid = blockUuid.value;
  // FIX 1: Cast to 'any' to allow initializing properties on an empty object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawContent: any = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
  
  // Default structure if empty
  if (!rawContent.fields) rawContent.fields = [];
  if (!rawContent.text) rawContent.text = { bgColor: '#ffffff' };
  if (!rawContent.button) rawContent.button = { label: 'Submit' };
  if (!rawContent.settings) rawContent.settings = {};

  // FIX 2: Return as 'Required' so the template knows 'text', 'button', etc. are not undefined
  return rawContent as Required<CustomFormContent>;
});

// --- HELPER FUNCTIONS ---

const addField = () => {
  const newField: FormField = {
    id: `field_${Date.now()}`,
    label: 'New Field',
    name: `field_${formContent.value.fields.length + 1}`,
    type: 'text',
    required: false,
    width: '100%'
  };
  formContent.value.fields.push(newField);
};

const removeField = (index: number) => {
  formContent.value.fields.splice(index, 1);
};
</script>