import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react'
import TodosPage from '@/app/todos/page'

const mockAuth = {
  getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'u@e.com' } } }),
  signOut: vi.fn().mockResolvedValue({})
}

const mockFrom = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], error: null }),
  insert: vi.fn().mockResolvedValue({ error: null }),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ error: null }),
  delete: vi.fn().mockReturnThis(),
}))

const mockOn = vi.fn(() => ({
  subscribe: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => {
  return {
    getSupabaseBrowser: () => ({
      auth: mockAuth,
      from: mockFrom,
      channel: vi.fn(() => ({
        on: mockOn,
      })),
      removeChannel: vi.fn(),
    }),
  }
})

describe('Todos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders todos page', async () => {
    render(<TodosPage />)
    await waitFor(() => {
      expect(mockAuth.getUser).toHaveBeenCalled()
    })
  })

  it('should add a new todo via real-time subscription', async () => {
    render(<TodosPage />)

    await waitFor(() => {
      expect(mockOn).toHaveBeenCalledWith(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        expect.any(Function)
      )
    })

    const callback = mockOn.mock.calls[0][2]
    const newTodo = {
      id: 't1',
      user_id: 'u1',
      title: 'New Todo',
      completed: false,
      inserted_at: new Date().toISOString(),
    }

    act(() => {
      callback({ eventType: 'INSERT', new: newTodo })
    })

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument()
    })
  })
})

