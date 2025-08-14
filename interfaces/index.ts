export interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string; 
}

export interface ImageInput {
  url: string;
}

export interface ProductInput {
  images: ImageInput[];
  name: string;
  description: string;
  price: string;
  origin_price: string;
}

export interface Plan {
  id: string;
  price_id: string;
  name: string;
  description: string;
  price: string; // formato exibido ("R$ 29,90")
  numberPrice: number; // valor numérico para cálculos
  period: string;
  color: string; // gradiente ou cor
  features: string[];
  limitations: string[];
  popular: boolean;
  buttonText: string;
}