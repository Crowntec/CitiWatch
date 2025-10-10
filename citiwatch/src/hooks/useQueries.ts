import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/user';
import { StatusService } from '@/services/status';
import { CategoryService } from '@/services/category';

// Query Keys
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  current: () => [...userQueryKeys.all, 'current'] as const,
  detail: (id: string) => [...userQueryKeys.all, 'detail', id] as const,
} as const;

export const statusQueryKeys = {
  all: ['statuses'] as const,
  lists: () => [...statusQueryKeys.all, 'list'] as const,
} as const;

export const categoryQueryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryQueryKeys.all, 'list'] as const,
} as const;

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: async () => {
      const result = await UserService.getUserProfile();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - user data doesn't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: async () => {
      const result = await UserService.getAllUsers();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Status hooks
export function useStatuses() {
  return useQuery({
    queryKey: statusQueryKeys.lists(),
    queryFn: async () => {
      const result = await StatusService.getAllStatuses();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - statuses rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Category hooks  
export function useCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.lists(),
    queryFn: async () => {
      const result = await CategoryService.getAllCategories();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - categories rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Utility hook for invalidating all caches (useful for logout)
export function useInvalidateAll() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.clear(); // Clear all caches
  };
}