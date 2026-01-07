<template>
  <div
    class="relative mt-5 p-4 sm:p-10 text-center"
    :style="{ backgroundColor: normalizedContent.text.bgColor }"
    data-testid="custom-form-block"
  >
    <h2
      v-if="normalizedContent.text.title"
      class="typography-headline-3 font-bold mb-4"
      v-html="normalizedContent.text.title"
    />
    
    <p
      v-if="normalizedContent.text.description"
      class="typography-text-base mb-6"
      v-html="normalizedContent.text.description"
    />

    <form class="mx-auto max-w-[600px] pt-2 text-left" novalidate @submit.prevent="onSubmit">
      <div class="flex flex-wrap -mx-2">
        
        <div
          v-for="field in fields"
          :key="field.id"
          class="px-2 mb-4"
          :class="field.width === '50%' ? 'w-full sm:w-1/2' : 'w-full'"
        >
          <label :for="field.id">
            <UiFormLabel>
              {{ field.label }} 
              <span v-if="field.required" class="text-negative-700">*</span>
            </UiFormLabel>
          </label>

          <SfInput
            v-if="['text', 'email', 'number'].includes(field.type)"
            :id="field.id"
            v-model="formData[field.name]"
            :type="field.type"
            :name="field.name"
            :placeholder="field.placeholder"
            :invalid="Boolean(errors[field.name])"
            class="w-full"
          />

          <SfTextarea
            v-else-if="field.type === 'textarea'"
            :id="field.id"
            v-model="formData[field.name]"
            :name="field.name"
            :placeholder="field.placeholder"
            :invalid="Boolean(errors[field.name])"
            class="w-full min-h-[100px]"
          />

          <div v-else-if="field.type === 'checkbox'" class="flex items-center mt-2">
            <SfCheckbox
              :id="field.id"
              v-model="formData[field.name]"
              :name="field.name"
              :invalid="Boolean(errors[field.name])"
              class="mr-2"
            />
            <label :for="field.id" class="cursor-pointer select-none">
              {{ field.label }} <span v-if="field.required" class="text-negative-700">*</span>
            </label>
          </div>

          <ErrorMessage as="div" :name="field.name" class="text-negative-700 text-sm mt-1" />
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <UiButton type="submit" size="lg" :disabled="isSubmitting">
          <SfLoaderCircular v-if="isSubmitting" size="base" />
          <template v-else>{{ normalizedContent.button.label }}</template>
        </UiButton>
      </div>

      <div v-if="successMsg" class="mt-4 text-positive-700 font-bold text-center">
        {{ successMsg }}
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { SfInput, SfTextarea, SfCheckbox, SfLoaderCircular } from '@storefront-ui/vue';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, boolean } from 'yup';
import type { CustomFormProps } from './types';

const props = defineProps<CustomFormProps>();
const { send } = useNotification();

// --- Normalize Content ---
const normalizedContent = computed(() => {
  const c = props.content || {};
  return {
    text: {
      title: c.text?.title ?? '',
      description: c.text?.description ?? '',
      bgColor: c.text?.bgColor ?? '#f5f5f5'
    },
    fields: c.fields ?? [],
    button: {
      label: c.button?.label ?? 'Submit'
    },
    settings: {
      successMessage: c.settings?.successMessage ?? 'Form submitted successfully!'
    }
  };
});

// Initialize fields
const fields = computed(() => normalizedContent.value.fields);
const isSubmitting = ref(false);
const successMsg = ref('');

// --- DYNAMIC SCHEMA GENERATION ---
const validationSchema = computed(() => {
  // FIX 1: Allow 'any' here because yup schemas are dynamic objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schemaShape: Record<string, any> = {};

  // FIX 2: Added parentheses (field) to fix 'arrow-parens' error
  fields.value.forEach((field) => {
    let rule;

    if (field.type === 'email') {
      rule = string().email('Invalid email format');
    } else if (field.type === 'number') {
      rule = string().matches(/^[0-9]+$/, 'Must be a number');
    } else if (field.type === 'checkbox') {
      rule = boolean();
      if (field.required) rule = rule.isTrue('This field is required');
    } else {
      rule = string();
    }

    if (field.required && field.type !== 'checkbox') {
      rule = rule.required('This field is required');
    }

    schemaShape[field.name] = rule;
  });

  return toTypedSchema(object(schemaShape));
});

// Setup Form
const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: validationSchema,
});

// --- Explicit Typing for formData ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formData: Record<string, any> = reactive({});

// Watch fields to initialize formData keys
watchEffect(() => {
  // FIX 3: Added parentheses (f) here as well
  fields.value.forEach((f) => {
    if (!(f.name in formData)) {
      formData[f.name] = f.type === 'checkbox' ? false : '';
    }
  });
});

// FIX 4: Added parentheses (values)
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  
  try {
    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // eslint-disable-next-line no-console
    console.log('Form Data Submitted:', values);
    
    send({ type: 'positive', message: normalizedContent.value.settings.successMessage });
    successMsg.value = normalizedContent.value.settings.successMessage;
    resetForm();
    
  } catch {
    send({ type: 'negative', message: 'Something went wrong.' });
  } finally {
    isSubmitting.value = false;
  }
});
</script>