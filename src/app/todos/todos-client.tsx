'use client'

import { useState, useOptimistic, useRef } from 'react'
import { type Todo } from './page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, LogOut, Trash2 } from "lucide-react"
import { addTodo, deleteTodo, toggleTodo } from './actions'
import { signOut } from '@/app/auth/signout/actions'

export default function TodosClient({ todos, userEmail }: { todos: Todo[], userEmail: string | null }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [optimisticTodos, setOptimisticTodos] = useOptimistic(
        todos,
        (state, { action, todo }: { action: 'add' | 'delete' | 'toggle', todo: any }) => {
            switch (action) {
                case 'add':
                    return [...state, todo]
                case 'delete':
                    return state.filter(t => t.id !== todo.id)
                case 'toggle':
                    return state.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
                default:
                    return state
            }
        }
    )

    const handleFormSubmit = async (formData: FormData) => {
        const title = formData.get('title') as string
        if (!title.trim()) return
        formRef.current?.reset()
        setOptimisticTodos({ action: 'add', todo: { id: Math.random(), title, completed: false, user_id: '' } })
        await addTodo(formData)
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>DK TO DO</CardTitle>
                    <CardDescription>
                        {optimisticTodos.filter(t => !t.completed).length} remaining
                    </CardDescription>
                </div>
                <form action={signOut}>
                    <Button variant="secondary" type="submit">
                        <LogOut className="h-4 w-4 mr-2" /> Sign out{userEmail ? ` (${userEmail})` : ""}
                    </Button>
                </form>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleFormSubmit(formData)
                }} data-testid="todo-form">
                    <div className="flex gap-2">
                        <Input
                            id="new-todo"
                            name="title"
                            placeholder="Add a new task"
                            aria-label="Add a new task"
                            required
                        />
                        <Button type="submit">
                            <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                    </div>
                </form>

                <Separator className="my-4" />

                <ul className="space-y-2">
                    {optimisticTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`flex items-center justify-between rounded-md border p-3 bg-card/50`}>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={todo.completed}
                                    onCheckedChange={async () => {
                                        setOptimisticTodos({ action: 'toggle', todo })
                                        await toggleTodo(todo.id, !todo.completed)
                                    }}
                                />
                                <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                                    {todo.title}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" aria-label="Delete todo" onClick={async () => {
                                setOptimisticTodos({ action: 'delete', todo })
                                await deleteTodo(todo.id)
                            }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                    {optimisticTodos.length === 0 && (
                        <li className="text-center text-sm text-muted-foreground">No todos yet</li>
                    )}
                </ul>
            </CardContent>
        </Card>
    )
}