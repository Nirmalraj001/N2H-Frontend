import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { User } from '../types';
import { useAppDispatch } from '../store/hooks';
import { showToast } from '../store/slices/uiSlice';
import { setUser } from '../store/slices/authSlice';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userService.updateUser(id, data),
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      dispatch(setUser(updatedUser));
      dispatch(showToast({ message: 'Profile updated successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to update profile', type: 'error' }));
    },
  });
};
