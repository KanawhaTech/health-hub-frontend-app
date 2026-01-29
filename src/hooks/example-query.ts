/**
 * Example React Query hooks
 * 
 * This file demonstrates how to use React Query in your project.
 * Import and use these patterns in your components.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Example: Fetch data with useQuery
export function useExampleData() {
  return useQuery({
    queryKey: ['example-data'],
    queryFn: async () => {
      const response = await fetch('/api/example');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}

// Example: Post data with useMutation
export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; value: string }) => {
      const response = await fetch('/api/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch queries after successful mutation
      queryClient.invalidateQueries({ queryKey: ['example-data'] });
    },
  });
}
