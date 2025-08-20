'use client'

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { type Todo } from "./page"

// Define the shape of our data, which is the Todo type

// These are the columns for our table.
export const columns: ColumnDef<Todo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.original.completed}
        onCheckedChange={() => {
            table.options.meta?.toggleTodo(row.original.id, row.original.completed)
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => {
      return (
        <span className={row.original.completed ? "line-through text-muted-foreground" : ""}>
          {row.getValue("title")}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const todo = row.original

      return (
        <div className="text-right">
            <Button variant="ghost" size="icon" aria-label="Delete todo" onClick={() => table.options.meta?.deleteTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      )
    },
  },
]
