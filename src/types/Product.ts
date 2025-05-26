
export interface Product {
  id: string;
  name: string;
  category: string;
  frontImage?: string;
  backImage?: string;
  supportImage?: string;
  createdAt?: string;
  customFields?: { [key: string]: string };
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  required: boolean;
  isDefault?: boolean;
}
