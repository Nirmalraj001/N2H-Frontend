import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BulkOrder, BulkOrderItem } from '../../types';
import { bulkOrderService } from '../../services/bulkOrderService';

export interface BulkOrderState {
  orders: BulkOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: BulkOrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchUserBulkOrders = createAsyncThunk(
  'bulkOrders/fetchUserBulkOrders',
  async (userId: string, thunkAPI) => {
    try {
      return await bulkOrderService.getUserBulkOrders(userId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Failed to fetch bulk orders');
    }
  }
);

export const createBulkOrder = createAsyncThunk(
  'bulkOrders/createBulkOrder',
  async (payload: Partial<BulkOrder> & { items: BulkOrderItem[] }, thunkAPI) => {
    try {
      return await bulkOrderService.createBulkOrder(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err?.response?.data?.message || 'Failed to create bulk order');
    }
  }
);

const bulkOrderSlice = createSlice({
  name: 'bulkOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserBulkOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBulkOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserBulkOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBulkOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBulkOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createBulkOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bulkOrderSlice.reducer;
