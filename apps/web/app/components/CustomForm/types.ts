export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'checkbox';

export interface FormField {
  id: string; // Unique ID for loop keys
  label: string;
  name: string; // The HTML name attribute
  type: FieldType;
  placeholder?: string;
  required: boolean;
  width: '50%' | '100%';
}

export interface CustomFormProps {
  title: string;
  description?: string;
  submitButtonLabel: string;
  successMessage: string;
  fields: FormField[];
}