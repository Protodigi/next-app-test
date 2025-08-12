import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TodosClient from '@/app/todos/todos-client'
import { vi } from 'vitest'
import React from 'react'

// Mock React's useOptimistic hook, as it's not supported in the JSDOM test environment.
// We replace it with a more realistic implementation that mimics useState.
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  const useOptimistic = (initialState: any, reducer: (state: any, action: any) => any) => {
    const [state, setState] = React.useState(initialState);
    const dispatch = (action: any) => {
      setState(prev => reducer(prev, action));
    };
    return [state, dispatch];
  };
  return { ...actual, useOptimistic };
});

// Mock the server actions module so we can assert they are called.
vi.mock('@/app/todos/actions', () => ({
  addTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
}))

// Import the mocked actions for use in the tests.
import { addTodo, toggleTodo, deleteTodo } from '@/app/todos/actions'

const mockTodos = [
  { id: '1', title: 'First Todo', completed: false, user_id: '1', inserted_at: new Date().toISOString() },
  { id: '2', title: 'Second Todo', completed: true, user_id: '1', inserted_at: new Date().toISOString() },
]

describe('TodosClient Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial todos correctly', () => {
    render(<TodosClient todos={mockTodos} userEmail="test@example.com" />)
    expect(screen.getByText('First Todo')).toBeInTheDocument()
    expect(screen.getByText('Second Todo')).toBeInTheDocument()
  })

  it('calls the server action when adding a new todo', async () => {
    render(<TodosClient todos={mockTodos} userEmail="test@example.com" />)
    const input = screen.getByPlaceholderText('Add a new task')
    const addButton = screen.getByRole('button', { name: /add/i })

    // Type a new todo and click the add button.
    fireEvent.change(input, { target: { value: 'A new todo' } })
    fireEvent.click(addButton)

    // Check that the server action was called.
    await waitFor(() => {
      expect(addTodo).toHaveBeenCalledTimes(1)
    })
  })

  it('optimistically toggles a todo and calls the server action', async () => {
    render(<TodosClient todos={mockTodos} userEmail="test@example.com" />)
    const checkbox = screen.getAllByRole('checkbox')[0] // First todo's checkbox

    fireEvent.click(checkbox)

    // Check for the optimistic UI update.
    await waitFor(() => {
      const todoText = screen.getByText('First Todo')
      expect(todoText).toHaveClass('line-through')
    })

    // Check that the server action was called with the correct toggle value.
    expect(toggleTodo).toHaveBeenCalledWith('1', true)
    expect(toggleTodo).toHaveBeenCalledTimes(1)
  })

  it('optimistically deletes a todo and calls the server action', async () => {
    render(<TodosClient todos={mockTodos} userEmail="test@example.com" />)
    const deleteButton = screen.getAllByRole('button', { name: /delete todo/i })[0]

    fireEvent.click(deleteButton)

    // Check for the optimistic UI update.
    await waitFor(() => {
      expect(screen.queryByText('First Todo')).not.toBeInTheDocument()
    })

    // Check that the server action was called.
    expect(deleteTodo).toHaveBeenCalledWith('1')
  })
})
