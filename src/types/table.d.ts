import { type RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    toggleTodo: (id: string, completed: boolean) => void
    deleteTodo: (id: string) => void
  }
}
