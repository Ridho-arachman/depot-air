export interface CreateProduct {
  name: string;
  price: number;
  description: string;
  stock: number;
  path_image: string;
}

export interface UpdateProduct {
  name?: string;
  price?: number;
  description?: string;
  stock?: number;
  path_image?: string;
}
