import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRequest } from './use-request';
import request from 'graphql-request';
import { useQueryContext } from '../../providers/query';

vi.mock('graphql-request', () => ({
  default: vi.fn(),
}));
vi.mock('../../providers/query', () => ({
  useQueryContext: vi.fn(),
}));

describe('useRequest', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockHasuraUrl = 'https://test-hasura.com/graphql';
  const mockToken = 'test-token';
  const mockDocument = 'query { test }';
  const mockVariables = { id: '123' };
  const mockResponse = { data: { test: 'success' } };
  const mockGetAccessToken = vi.fn().mockResolvedValue(mockToken);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.mocked(useQueryContext).mockReturnValue({
      hasuraUrl: mockHasuraUrl,
    });
    vi.mocked(request).mockResolvedValue(mockResponse);
  });

  it('should fetch data successfully with variables', async () => {
    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['test'],
          getAccessToken: mockGetAccessToken,
          document: mockDocument,
          variables: mockVariables,
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockGetAccessToken).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith({
      url: mockHasuraUrl,
      document: mockDocument,
      requestHeaders: {
        Authorization: `Bearer ${mockToken}`,
      },
      variables: mockVariables,
    });
  });

  it('should fetch data without variables', async () => {
    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['settings'],
          getAccessToken: mockGetAccessToken,
          document: 'query GetSettings { settings { theme } }',
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockGetAccessToken).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith({
      url: mockHasuraUrl,
      document: expect.any(String),
      requestHeaders: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('should handle undefined variables', async () => {
    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['users'],
          getAccessToken: mockGetAccessToken,
          document: 'query GetUsers { users { id name } }',
          variables: undefined,
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockGetAccessToken).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith({
      url: mockHasuraUrl,
      document: expect.any(String),
      requestHeaders: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('should handle token fetch error', async () => {
    const tokenError = new Error('Failed to get token');
    mockGetAccessToken.mockRejectedValueOnce(tokenError);

    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['test-error'],
          getAccessToken: mockGetAccessToken,
          document: mockDocument,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(request).not.toHaveBeenCalled();
  });

  it('should handle request error', async () => {
    const requestError = new Error('GraphQL request failed');
    vi.mocked(request).mockRejectedValueOnce(requestError);

    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['test-request-error'],
          getAccessToken: mockGetAccessToken,
          document: mockDocument,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(mockGetAccessToken).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledOnce();
  });

  it('should use cached data on subsequent requests', async () => {
    const { result, rerender } = renderHook(
      () =>
        useRequest({
          queryKey: ['test-cache'],
          getAccessToken: mockGetAccessToken,
          document: mockDocument,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender();

    expect(request).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should handle loading state', async () => {
    const { result } = renderHook(
      () =>
        useRequest({
          queryKey: ['test-loading'],
          getAccessToken: mockGetAccessToken,
          document: mockDocument,
        }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
