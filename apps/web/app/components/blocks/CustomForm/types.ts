export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'checkbox';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  width: '100%' | '50%';
}

// Remove "?" from these properties to make them required by default
export interface CustomFormContent {
  text: {
    title: string;
    description: string;
    bgColor: string;
  };
  fields: FormField[];
  button: {
    label: string;
  };
  settings: {
    successMessage: string;
    recipientEmail?: string;
  };
}

export interface CustomFormProps {
  // Use Partial here because incoming data might be incomplete
  content: Partial<CustomFormContent>;
  index?: number;
}