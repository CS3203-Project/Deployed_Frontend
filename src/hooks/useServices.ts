import { useState, useEffect, useCallback, useRef } from 'react';
import { serviceApi } from '../api/serviceApi';
import type { ServiceResponse } from '../api/serviceApi';

interface UseServicesResult {
  services: ServiceResponse[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useServices = (params?: {
  providerId?: string;
  categoryId?: string;
  isActive?: boolean;
  skip?: number;
  take?: number;
}): UseServicesResult => {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);

  const fetchServices = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      
      const response = await serviceApi.getServices(params, abortControllerRef.current?.signal);
      
      // Check if component is still mounted and request wasn't aborted
      if (!isMountedRef.current) {
        return;
      }
      
      if (response.success && Array.isArray(response.data)) {
        setServices(response.data);
        setError(null);
      } else {
        console.error('API Error:', response);
        setError(response.message || 'Failed to fetch services');
        setServices([]);
      }
    } catch (err) {
      // Check if this is a canceled request - don't treat as error
      if (err instanceof Error && (err.name === 'AbortError' || err.name === 'CanceledError')) {
        return;
      }
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) {
        return;
      }
      
      console.error('Fetch Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching services';
      setError(errorMessage);
      setServices([]);
    } finally {
      isLoadingRef.current = false;
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [params?.providerId, params?.categoryId, params?.isActive, params?.skip, params?.take]);

  const refetch = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchServices();

    // Cleanup function to abort ongoing requests and mark component as unmounted
    return () => {
      isMountedRef.current = false;
      isLoadingRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchServices]);

  return {
    services,
    loading,
    error,
    refetch
  };
};

export default useServices;
