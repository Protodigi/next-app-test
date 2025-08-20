'use client'

import { useRef } from 'react'
import { type Todo } from './page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Plus, LogOut } from "lucide-react"
import { addTodo, deleteTodo, toggleTodo } from './actions'
import { signOut } from '@/app/auth/signout/actions'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { columns } from './columns'
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table'

export default function TodosClient({ userEmail }: { userEmail: string | null }) {
    const queryClient = useQueryClient()
    const formRef = useRef<HTMLFormElement>(null)

    // Query to fetch todos
    const { data: todos, isLoading, isError, error } = useQuery<Todo[]>({ 
        queryKey: ['todos'], 
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase.from('todos').select('*').order('inserted_at', { ascending: false })
            if (error) throw new Error(error.message)
            return data
        }
    })

    // Mutation for adding a new todo
    const addTodoMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: (newTodo) => {
            queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) => [...oldTodos, newTodo])
            toast.success("Todo added successfully!")
            formRef.current?.reset()
        },
        onError: (error) => {
            toast.error(`Failed to add todo: ${error.message}`)
        },
    })

    // Mutation for toggling a todo
    const toggleTodoMutation = useMutation({
        mutationFn: ({ id, completed }: { id: string, completed: boolean }) => toggleTodo(id, completed),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        },
        onError: (error) => {
            toast.error(`Failed to update todo: ${error.message}`)
        },
    })

    // Mutation for deleting a todo
    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
            toast.success("Todo deleted.")
        },
        onError: (error) => {
            toast.error(`Failed to delete todo: ${error.message}`)
        },
    })

    const table = useReactTable({
        data: todos ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            toggleTodo: toggleTodoMutation.mutate,
            deleteTodo: deleteTodoMutation.mutate,
        }
    })

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const title = formData.get('title') as string
        if (title.trim()) {
            addTodoMutation.mutate(formData)
        }
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>DK TO DO</CardTitle>
                    <CardDescription>
                        {todos ? `${todos.filter(t => !t.completed).length} remaining` : 'Loading...'}
                    </CardDescription>
                </div>
                <form action={signOut}>
                    <Button variant="secondary" type="submit">
                        <LogOut className="h-4 w-4 mr-2" /> Sign out{userEmail ? ` (${userEmail})` : ""}
                    </Button>
                </form>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleFormSubmit} data-testid="todo-form">
                    <div className="flex gap-2">
                        <Input
                            id="new-todo"
                            name="title"
                            placeholder="Add a new task"
                            aria-label="Add a new task"
                            required
                            disabled={addTodoMutation.isPending}
                        />
                        <Button type="submit" disabled={addTodoMutation.isPending}>
                            <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                    </div>
                </form>

                <Separator className="my-4" />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Loading...</TableCell></TableRow>}
                            {isError && <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-red-500">Error: {error.message}</TableCell></TableRow>}
                            {!isLoading && !isError && table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                !isLoading && !isError && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No todos yet.
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
