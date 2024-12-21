import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, ErrorFallback } from '.';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock window.location.reload
    const reloadMock = vi.fn();
    const originalLocation = window.location;
    // @ts-ignore mock implementation
    delete window.location;
    window.location = { ...originalLocation, reload: reloadMock };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ErrorFallback', () => {
    it('renders the error UI', () => {
      const mockReset = vi.fn();
      render(
        <ErrorFallback
          error={new Error('Test error')}
          resetErrorBoundary={mockReset}
        />
      );

      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('An unexpected error occurred')).toBeTruthy();

      const tryAgainButton = screen.getByText('Try again');
      expect(tryAgainButton).toBeTruthy();

      fireEvent.click(tryAgainButton);
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('ErrorBoundary component', () => {
    const TestError = () => {
      throw new Error('Test error');
      return null;
    };

    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeTruthy();
    });

    it('renders the fallback when there is an error', () => {
      render(
        <ErrorBoundary>
          <TestError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('An unexpected error occurred')).toBeTruthy();
    });

    it('reloads the page when try again is clicked', () => {
      render(
        <ErrorBoundary>
          <TestError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByText('Try again');
      fireEvent.click(tryAgainButton);

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
