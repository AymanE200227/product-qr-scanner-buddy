
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  quantity: number;
  createdAt?: string;
  customFields?: { [key: string]: string };
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  required: boolean;
}
