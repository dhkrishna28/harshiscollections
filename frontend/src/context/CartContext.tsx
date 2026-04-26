import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import { useAuth } from "./AuthContext";
import type { Cart, Product, CartItem } from "../types";

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  // Accept either a product id (for authenticated flows) OR a full Product object (for guest flows)
  addItem: (
    productOrId: number | Product,
    quantity?: number,
    selectedSize?: string | null,
  ) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const isSyncingGuestCart = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const cart = data ?? null;
  // Guest cart stored in localStorage
  const [guestCart, setGuestCart] = useState<Cart | null>(() => {
    try {
      const raw = localStorage.getItem("hc_cart");
      return raw ? (JSON.parse(raw) as Cart) : { id: 0, items: [] };
    } catch {
      return { id: 0, items: [] };
    }
  });

  const effectiveCart = isAuthenticated ? cart : guestCart;
  const itemCount =
    effectiveCart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const saveGuestCart = (c: Cart) => {
    try {
      localStorage.setItem("hc_cart", JSON.stringify(c));
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // keep localStorage in sync if guestCart changes
    if (!isAuthenticated && guestCart) saveGuestCart(guestCart);
  }, [guestCart, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !guestCart?.items.length || isSyncingGuestCart.current) return;

    isSyncingGuestCart.current = true;

    void (async () => {
      try {
        for (const item of guestCart.items) {
          await cartService.addItem(item.product_id, item.quantity, item.selected_size);
        }
        const empty: Cart = { id: 0, items: [] };
        setGuestCart(empty);
        localStorage.removeItem("hc_cart");
        await invalidateCart();
      } catch (error) {
        console.error("Failed to merge guest cart into account cart", error);
      } finally {
        isSyncingGuestCart.current = false;
      }
    })();
  }, [guestCart, isAuthenticated, queryClient]);

  const addItem = async (
    productOrId: number | Product,
    quantity = 1,
    selectedSize?: string | null,
  ) => {
    if (isAuthenticated) {
      const productId =
        typeof productOrId === "number" ? productOrId : productOrId.id;
      await cartService.addItem(productId, quantity, selectedSize);
      await invalidateCart();
      return;
    }

    // Guest flow: require full product object to store in local cart
    if (typeof productOrId === "number") {
      throw new Error("Guest addItem requires full product object");
    }
    const product = productOrId as Product;
    setGuestCart((current) => {
      const next: Cart = current ? { ...current } : { id: 0, items: [] };
      // try to find existing item with same product and size
      const existing = next.items.find(
        (it) =>
          it.product_id === product.id &&
          (it.selected_size ?? null) === (selectedSize ?? null),
      );
      if (existing) {
        existing.quantity = existing.quantity + quantity;
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          cart_id: 0,
          product_id: product.id,
          selected_size: selectedSize ?? null,
          quantity,
          product,
        };
        next.items = [...next.items, newItem];
      }
      saveGuestCart(next);
      return next;
    });
  };

  const removeItem = async (itemId: number) => {
    if (isAuthenticated) {
      await cartService.removeItem(itemId);
      await invalidateCart();
      return;
    }
    setGuestCart((current) => {
      if (!current) return current;
      const next = {
        ...current,
        items: current.items.filter((it) => it.id !== itemId),
      };
      saveGuestCart(next);
      return next;
    });
  };

  const updateItem = async (itemId: number, quantity: number) => {
    if (isAuthenticated) {
      await cartService.updateItem(itemId, quantity);
      await invalidateCart();
      return;
    }
    setGuestCart((current) => {
      if (!current) return current;
      const next = {
        ...current,
        items: current.items.map((it) =>
          it.id === itemId ? { ...it, quantity } : it,
        ),
      };
      saveGuestCart(next);
      return next;
    });
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await cartService.clearCart();
      await invalidateCart();
      return;
    }
    const empty: Cart = { id: 0, items: [] };
    setGuestCart(empty);
    saveGuestCart(empty);
  };

  return (
    <CartContext.Provider
      value={{
        cart: effectiveCart,
        isLoading: isAuthenticated ? isLoading : false,
        itemCount,
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
