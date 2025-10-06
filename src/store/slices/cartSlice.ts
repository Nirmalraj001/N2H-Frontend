import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
import { cartService } from '../../services/cartService';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await cartService.getCart();
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      await cartService.addToCart(productId, quantity);
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      if (quantity === 0) {
        await cartService.removeFromCart(productId);
      } else {
        await cartService.updateCartItem(productId, quantity);
      }
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(productId);
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  } as CartState,
  reducers: {
    optimisticAddToCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + action.payload.quantity;
      } else {
        state.items.push({ productId: action.payload.productId, quantity: action.payload.quantity });
      }
    },
    optimisticUpdateCart: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const existing = state.items.find(item => item.productId === action.payload.productId);
      if (existing) {
        if (action.payload.quantity === 0) {
          state.items = state.items.filter(item => item.productId !== action.payload.productId);
        } else {
          existing.quantity = action.payload.quantity;
        }
      }
    },
    optimisticRemoveFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add to cart';
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update cart';
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove from cart';
      });
  },
});

export const { optimisticAddToCart, optimisticUpdateCart, optimisticRemoveFromCart } = cartSlice.actions;
export default cartSlice.reducer;
