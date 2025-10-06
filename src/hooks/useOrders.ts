import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import { useAppDispatch } from '../store/hooks';
import { showToast } from '../store/slices/uiSlice';
import { clearCart } from '../store/slices/cartSlice';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAllOrders(),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      dispatch(clearCart());
      dispatch(showToast({ message: 'Order placed successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to place order', type: 'error' }));
    },
  });
};

export const useUpdateOrderStatus = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) => orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      dispatch(showToast({ message: 'Order status updated successfully', type: 'success' }));
    },
    onError: (error: any) => {
      dispatch(showToast({ message: error.response?.data?.message || 'Failed to update order status', type: 'error' }));
    },
  });
};
