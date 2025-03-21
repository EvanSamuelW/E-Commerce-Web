import {Product} from './product';

export interface CartItems {
    cartItemId: number;
    addedAt: string; 
    chosenColor: string; 
    chosenSize: string;
    quantity: number; 
    product: Product; 
    reviewed: boolean;
  }

  export interface Cart {
    cartId: number;
    createdAt: string; 
    cartItems : CartItems[]
  }


  export interface TransactionItems {
    id: number;
    cart: Cart; 
    totalAmount: number; 
    transactionDate: string;
    paymentMethod: string; 
    shippingAddress: string; 
    billingAddress: string
  }

  export interface wishlistItems {
    wishlistItemId: number;
    addedAt: string; 
    product: Product; 
  }

