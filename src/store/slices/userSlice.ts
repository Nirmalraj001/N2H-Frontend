import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, Address } from '../../types';
import { userService } from '../../services/userService';

interface UserState {
  users: User[];
  currentProfile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentProfile: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async () => {
    return await userService.getAllUsers();
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: string) => {
    return await userService.getUserById(id);
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: Partial<User> }) => {
    return await userService.updateUser(id, data);
  }
);

export const addAddress = createAsyncThunk(
  'users/addAddress',
  async ({ userId, address }: { userId: string; address: Omit<Address, 'id'> }) => {
    return await userService.addAddress(userId, address);
  }
);

export const updateAddress = createAsyncThunk(
  'users/updateAddress',
  async ({ userId, addressId, updates }: { userId: string; addressId: string; updates: Partial<Address> }) => {
    return await userService.updateAddress(userId, addressId, updates);
  }
);

export const deleteAddress = createAsyncThunk(
  'users/deleteAddress',
  async ({ userId, addressId }: { userId: string; addressId: string }) => {
    return await userService.deleteAddress(userId, addressId);
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export const { clearError, setCurrentProfile } = userSlice.actions;
export default userSlice.reducer;
