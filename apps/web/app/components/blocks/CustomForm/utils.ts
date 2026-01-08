import type { CustomFormProps } from './types';

export const cleanFormContent = (content: Partial<CustomFormProps>): CustomFormProps => {
  return {
    title: content.title || 'Contact Us',
    description: content.description || '',
    submitButtonLabel: content.submitButtonLabel || 'Send Message',
    successMessage: content.successMessage || 'Thank you!',
    fields: Array.isArray(content.fields) ? content.fields : []
  };
};