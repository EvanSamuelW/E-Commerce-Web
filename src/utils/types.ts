export interface CartItemType {
    id: number;
    name: string;
    price: number;
    size: string,
        color: string,
    quantity: number;
    imageUrl: string
  }
  
  export interface CartState {
    items: CartItemType[];
  }