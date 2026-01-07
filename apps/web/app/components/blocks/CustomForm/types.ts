export interface FormField {
  id: string; // Unique ID for v-for loops
  type: 'text' | 'email' | 'textarea' | 'number' | 'checkbox';
  label: string;
  name: string; // The key used in the data payload (e.g., 'firstName')
  placeholder?: string;
  required: boolean;
  width: '100%' | '50%'; // Layout option
}

export interface CustomFormContent {
  text?: {
    title?: string;
    description?: string;
    bgColor?: string;
  };
  fields: FormField[];
  button?: {
    label?: string;
  };
  settings?: {
    successMessage?: string;
    recipientEmail?: string; // Optional: if you have logic to handle this backend side
  };
}

export interface CustomFormProps {
  content: CustomFormContent;
  index?: number;
}