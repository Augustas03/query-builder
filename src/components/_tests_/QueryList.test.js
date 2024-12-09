import { render, screen, act } from '@testing-library/react';
import QueryList from '../QueryList';
import { bookService } from '../../services/api/bookService';

// Mock the bookService
jest.mock('../../services/api/bookService', () => ({
  bookService: {
    executeQuery: jest.fn().mockResolvedValue({ title: '1984' })
  }
}));

describe('QueryList', () => {
  const mockQueries = [{
    queryName: 'Test Query',
    interval: '1',
    parameters: [{ name: 'title', value: '1984' }],
    responseAttributes: ['Title']
  }];

  const mockOnRemove = jest.fn();
  const mockOnResultUpdate = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders queries', () => {
    render(
      <QueryList 
        queries={mockQueries}
        onRemove={mockOnRemove}
        onResultUpdate={mockOnResultUpdate}
      />
    );

    expect(screen.getByText('Test Query')).toBeInTheDocument();
    expect(screen.getByText('Every 1 min')).toBeInTheDocument();
  });

  it('sets up intervals', async () => {
    render(
      <QueryList 
        queries={mockQueries}
        onRemove={mockOnRemove}
        onResultUpdate={mockOnResultUpdate}
      />
    );

    // Advance timers and wait for promises to resolve
    await act(async () => {
      jest.advanceTimersByTime(60000); // Advance 1 minute
    });

    expect(bookService.executeQuery).toHaveBeenCalled();
    expect(mockOnResultUpdate).toHaveBeenCalled();
  });

  it('cleans up intervals on unmount', async () => {
    const { unmount } = render(
      <QueryList 
        queries={mockQueries}
        onRemove={mockOnRemove}
        onResultUpdate={mockOnResultUpdate}
      />
    );

    unmount();

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockOnResultUpdate).not.toHaveBeenCalled();
  });
});