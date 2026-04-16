import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import type { Cart } from '../types';

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  addItem: (productId: number, quantity?: number, selectedSize?: string | null) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const cart = data ?? null;
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const addItem = async (productId: number, quantity = 1, selectedSize?: string | null) => {
    await cartService.addItem(productId, quantity, selectedSize);
    await invalidateCart();
  };

  const removeItem = async (itemId: number) => {
    await cartService.removeItem(itemId);
    await invalidateCart();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await cartService.updateItem(itemId, quantity);
    await invalidateCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    await invalidateCart();
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, itemCount, addItem, removeItem, updateItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
