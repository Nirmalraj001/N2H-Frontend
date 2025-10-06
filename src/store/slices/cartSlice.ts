import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
import { cartService } from '../../services/cartService';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await cartService.getCart();
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    await cartService.addToCart(productId, quantity);
    return await cartService.getCart(); // return updated cart
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    await cartService.updateCartItem(productId, quantity);
    return await cartService.getCart();
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string) => {
    await cartService.removeFromCart(productId);
    return await cartService.getCart();
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      });
  },
});

export default cartSlice.reducer;
