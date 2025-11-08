"use client"

import { useEffect, useState } from "react"

interface TodoItem {
  id: number
  text: string
  completed: boolean
}


interface props{
  showtodo:boolean;
  onClose: ()=>void;
}


const Todo = ({showtodo,onClose}:props) => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState("")

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim() === "") return
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    }
    setTodos((prev) => [newTodo, ...prev])
    setInput("")
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="bg-purple-900/80 backdrop-blur p-6 rounded-lg shadow-xl text-white w-96 border border-white/10">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Todo List</h2>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          className="flex-1 px-3 py-2 rounded-l-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/50"
          placeholder="Add task..."
        />
        <button
          onClick={addTodo}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-r-lg font-semibold"
        >
          +
        </button>
      </div>

      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex justify-between items-center bg-white/10 p-3 rounded-lg border border-white/10 ${
              todo.completed ? "opacity-60" : ""
            }`}
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`flex-1 cursor-pointer text-sm transition-all duration-300 ${
                todo.completed ? "line-through text-white/50" : "text-white hover:text-purple-200"
              }`}
            >
              <span className="mr-3 text-lg">{todo.completed ? "[x]" : "[ ]"}</span>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="ml-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 flex-shrink-0"
            >
              Delete
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2"></div>
            <p>No tasks yet. Add one above!</p>
          </li>
        )}
      </ul>

      <div className="mt-4 text-center text-xs text-white/50">
        {todos.length} {todos.length === 1 ? "task" : "tasks"} • {todos.filter((t) => t.completed).length} completed
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation-name: slideIn;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-purple-500::-webkit-scrollbar-thumb {
          background: rgb(168 85 247);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default Todo