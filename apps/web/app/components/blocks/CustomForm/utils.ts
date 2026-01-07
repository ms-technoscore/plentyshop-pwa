import type { CustomFormContent } from './types';

// UPDATED: Return type is now "Required<CustomFormContent>"
export function initializeCustomFormContent(content: Partial<CustomFormContent>): Required<CustomFormContent> {
  // 1. Text Settings
  if (!content.text) {
    content.text = { title: 'Contact Us', description: '', bgColor: '#ffffff' };
  } else {
    if (content.text.title === undefined) content.text.title = 'Contact Us';
    if (content.text.description === undefined) content.text.description = '';
    if (content.text.bgColor === undefined) content.text.bgColor = '#ffffff';
  }

  // 2. Fields Array
  if (!content.fields) {
    content.fields = [];
  }

  // 3. Button Settings
  if (!content.button) {
    content.button = { label: 'Submit' };
  } else {
    if (content.button.label === undefined) content.button.label = 'Submit';
  }

  // 4. General Settings
  if (!content.settings) {
    content.settings = { successMessage: 'Thank you for contacting us!' };
  } else {
    if (content.settings.successMessage === undefined) content.settings.successMessage = 'Thank you for contacting us!';
  }

  // UPDATED: Cast the result as Required
  return content as Required<CustomFormContent>;
}