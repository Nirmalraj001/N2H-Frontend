import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';
import { useAppDispatch } from '../store/hooks';
import { showToast } from '../store/slices/uiSlice';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
  });
};

export const useCreateCategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Category, 'id'>) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      dispatch(showToast({ message: 'Category created successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to create category', type: 'error' }));
    },
  });
};

export const useUpdateCategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      dispatch(showToast({ message: 'Category updated successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to update category', type: 'error' }));
    },
  });
};

export const useDeleteCategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      dispatch(showToast({ message: 'Category deleted successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to delete category', type: 'error' }));
    },
  });
};
