import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest } from '../services/authService';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      dispatch(setCredentials({ user: response.user, token: response.token }));
      queryClient.invalidateQueries({ queryKey: ['user'] });
      dispatch(showToast({ message: 'Login successful!', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Login failed', type: 'error' }));
    },
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      dispatch(setCredentials({ user: response.user, token: response.token }));
      queryClient.invalidateQueries({ queryKey: ['user'] });
      dispatch(showToast({ message: 'Registration successful!', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Registration failed', type: 'error' }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    dispatch(logoutAction());
    queryClient.clear();
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
  };
};

export const useForgotPassword = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      dispatch(showToast({ message: 'Password reset link sent to your email', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to send reset link', type: 'error' }));
    },
  });
};
