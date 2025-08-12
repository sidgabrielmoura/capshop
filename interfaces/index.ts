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