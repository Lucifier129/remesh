import { Remesh } from '../../../remesh'
import { IsAllCompletedQuery } from '../query'

export type Todo = {
    id: number
    content: string
    completed: boolean
}

export const TodoListState = Remesh.state<Todo[]>({
    name: 'TodoListState',
    default: []
})

export type AddTodoFailedEventData = {
    message: string
}

export const AddTodoFailedEvent = Remesh.event<AddTodoFailedEventData>({
    name: 'AddTodoFailedEvent'
})

export type AddTodoSucceededEventData = {
    newTodo: Todo
}

export const AddTodoSuccessEvent = Remesh.event<AddTodoSucceededEventData>({
    name: 'AddTodoSuccessEvent'
})

let todoUid = 0

export const addTodo = Remesh.command({
    name: 'addTodo',
    impl: ({ get }, todoContent: string) => {
        const todoList = get(TodoListState)

        if (todoContent.length === 0) {
            return AddTodoFailedEvent({
                message: `Unexpected empty todo input`
            })
        }

        const newTodo: Todo = {
            id: todoUid++,
            content: todoContent,
            completed: false
        }

        const newTodoList = todoList.concat(newTodo)

        return [
            TodoListState(newTodoList),
            AddTodoSuccessEvent({ newTodo })
        ]
    }
})

export const removeTodo = Remesh.command({
    name: 'removeTodo',
    impl: ({ get }, todoId: number) => {
        const todoList = get(TodoListState)
        const newTodoList = todoList.filter(todo => todo.id !== todoId)

        return TodoListState(newTodoList)
    }
})

export type UpdateTodoPayload = {
    todoId: number
    content: string
}

export const updateTodo = Remesh.command({
    name: 'updateTodo',
    impl: ({ get }, payload: UpdateTodoPayload) => {
        const todoList = get(TodoListState)
        const newTodoList = todoList.map(todo => {
            if (todo.id !== payload.todoId) {
                return todo
            }
            return {
                ...todo,
                content: payload.content
            }
        })

        return TodoListState(newTodoList)
    }
})

export const toggleTodo = Remesh.command({
    name: 'toggleTodo',
    impl: ({ get }, todoId: number) => {
        const todoList = get(TodoListState)
        const newTodoList = todoList.map(todo => {
            if (todo.id !== todoId) {
                return todo
            }
            return {
                ...todo,
                completed: !todo.completed
            }
        })

        return TodoListState(newTodoList)
    }
})

export const toggleAllTodos = Remesh.command({
    name: 'toggleAllTodos',
    impl: ({ get }) => {
        const todoList = get(TodoListState)
        const isAllCompleted = get(IsAllCompletedQuery)

        const newTodoList = todoList.map(todo => {
            return {
                ...todo,
                completed: !isAllCompleted
            }
        })

        return TodoListState(newTodoList)
    }
})
