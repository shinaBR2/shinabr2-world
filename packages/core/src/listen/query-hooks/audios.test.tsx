import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLoadAudios } from './audios';
import { QueryProvider } from '../../providers/query';

const mockConfig = {
  hasuraUrl: 'https://test-hasura.url',
};
const mockUseQuery = vi.fn();

// Mock modules using Vitest
vi.mock('graphql-request', () => ({
  default: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any) => mockUseQuery(...args),
}));

const queryContextValue = {
  hasuraUrl: 'https://test-hasura.url',
};

vi.mock('../../providers/query', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => children,
  useQueryContext: () => queryContextValue,
}));

describe('useLoadAudios', () => {
  // Mock data
  const mockAudios = [
    {
      id: '1',
      name: 'Test Audio 1',
      source: 'source1.mp3',
      thumbnail_url: 'thumb1.jpg',
      public: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Audio 2',
      source: 'source2.mp3',
      thumbnail_url: 'thumb2.jpg',
      public: false,
      created_at: '2024-01-02T00:00:00Z',
    },
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryProvider config={mockConfig}>{children}</QueryProvider>;
  };

  const mockGetAccessToken = vi.fn().mockResolvedValue('test-token');

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
  });

  it('should fetch audios without tag filter', () => {
    mockUseQuery.mockReturnValue({
      data: { audios: mockAudios },
      isLoading: false,
    });

    const { result } = renderHook(
      () => useLoadAudios({ getAccessToken: mockGetAccessToken }),
      { wrapper }
    );

    expect(result.current.audios).toEqual(mockAudios);
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch audios with tag filter', () => {
    const tagName = 'test-tag';

    mockUseQuery.mockReturnValue({
      data: { audios: mockAudios },
      isLoading: false,
    });

    const { result } = renderHook(
      () => useLoadAudios({ getAccessToken: mockGetAccessToken, tagName }),
      { wrapper }
    );

    expect(result.current.audios).toEqual(mockAudios);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { result } = renderHook(
      () => useLoadAudios({ getAccessToken: mockGetAccessToken }),
      { wrapper }
    );

    expect(result.current.audios).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle empty audios array', () => {
    mockUseQuery.mockReturnValue({
      data: { audios: [] },
      isLoading: false,
    });

    const { result } = renderHook(
      () => useLoadAudios({ getAccessToken: mockGetAccessToken }),
      { wrapper }
    );

    expect(result.current.audios).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
