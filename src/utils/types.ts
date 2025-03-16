import {Product} from './product';

export interface CartItems {
    cartItemId: number;
    addedAt: string; 
    chosenColor: string; 
    chosenSize: string;
    quantity: number; 
    product: Product; 
  }

  export interface wishlistItems {
    wishlistItemId: number;
    addedAt: string; 
    product: Product; 
  }

