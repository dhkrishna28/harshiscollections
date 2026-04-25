export interface CartItem {
  id: number | string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  img: string;
}

export const sampleCart: CartItem[] = [
  {
    id: 1,
    name: "Floral Print Dress",
    variant: "Sand / M",
    price: 59,
    qty: 2,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Pleated Midi Skirt",
    variant: "Black / S",
    price: 45,
    qty: 1,
    img: "https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Linen Blouse",
    variant: "Cream / M",
    price: 72,
    qty: 1,
    img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=300&auto=format&fit=crop&q=80",
  },
];

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;
