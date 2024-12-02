import {ProductClass} from '@/types';
import {create} from 'zustand';

// Define the state shape and associated actions for the store
interface ProductState {
  product: ProductClass;
  products: ProductClass[];
  setProduct: (product: ProductClass) => void;
  setProducts: (products: ProductClass[]) => void;
}

// Create the Zustand store with typed state and actions
export const useProductStore = create<ProductState>(set => ({
  product: null,
  products: [],
  setProduct: newProduct => set({product: newProduct}),
  setProducts: newProducts => set({products: newProducts}),
}));
