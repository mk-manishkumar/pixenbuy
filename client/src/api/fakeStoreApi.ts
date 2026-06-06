import axios from "axios";
const BASE_URL = "https://fakestoreapi.com";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${BASE_URL}/products`);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${BASE_URL}/products/${id}`);
  return response.data;
};

export const getAllCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${BASE_URL}/products/categories`);
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${BASE_URL}/products/category/${category}`);
  return response.data;
};
