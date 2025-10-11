import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ComplaintService, type ComplaintCreateRequest } from '@/services/complaint';

// Query Keys for consistent caching
export const complaintsQueryKeys = {
  all: ['complaints'] as const,
  lists: () => [...complaintsQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...complaintsQueryKeys.lists(), { filters }] as const,
  details: () => [...complaintsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintsQueryKeys.details(), id] as const,
  user: () => [...complaintsQueryKeys.all, 'user'] as const,
} as const;

// Hook for getting all complaints (Admin)
export function useComplaints() {
  return useQuery({
    queryKey: complaintsQueryKeys.lists(),
    queryFn: async () => {
      const result = await ComplaintService.getAllComplaints();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for getting user's complaints
export function useUserComplaints() {
  return useQuery({
    queryKey: complaintsQueryKeys.user(),
    queryFn: async () => {
      const result = await ComplaintService.getUserComplaints();
      if (!result.success) {
        // If it's an access denied error, it means auth issue
        if (result.message.includes('Access denied') || result.message.includes('HTTP 403')) {
          throw new Error('Authentication required. Please log in again.');
        }
        throw new Error(result.message);
      }
      return result.data || [];
    },
    staleTime: 1000 * 60 * 1, // 1 minute (user data changes more frequently)
    gcTime: 1000 * 60 * 3, // 3 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('Authentication required') || 
          error.message.includes('Access denied') ||
          error.message.includes('HTTP 403')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Hook for getting a specific complaint by ID
export function useComplaint(id: string) {
  return useQuery({
    queryKey: complaintsQueryKeys.detail(id),
    queryFn: async () => {
      const result = await ComplaintService.getComplaintById(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!id, // Only run if ID exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for submitting a complaint
export function useSubmitComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ complaint, file }: { complaint: ComplaintCreateRequest; file?: File }) => {
      const result = await ComplaintService.submitComplaint(complaint, file);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch user complaints when a new one is submitted
      queryClient.invalidateQueries({ queryKey: complaintsQueryKeys.user() });
      queryClient.invalidateQueries({ queryKey: complaintsQueryKeys.lists() });
    },
  });
}

// Hook for updating complaint status
export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statusUpdate }: { id: string; statusUpdate: { id: string } }) => {
      const result = await ComplaintService.updateComplaintStatus(id, statusUpdate);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific complaint and lists
      queryClient.invalidateQueries({ queryKey: complaintsQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: complaintsQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: complaintsQueryKeys.user() });
    },
  });
}

// Utility hook for prefetching complaints
export function usePrefetchComplaint() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: complaintsQueryKeys.detail(id),
      queryFn: async () => {
        const result = await ComplaintService.getComplaintById(id);
        if (!result.success) {
          throw new Error(result.message);
        }
        return result.data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };
}