import { atom, useAtom } from "jotai";
import type { Todo } from "./todo.entity";

const todoAtom = atom<Todo[]>([]);

export const useTodoStore = () => {
  const [todos, setTodos] = useAtom(todoAtom);

  return {
    getAll: () => todos,
    set: (newTodos: Todo[]) => {
      setTodos(newTodos);
    },
    add: (newTodo: Todo) => {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    },
    remove: (todoId: number) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    },
    isCompleteChange: (todoId: number, isCompleted: boolean) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isCompleted } : todo
        )
      );
    },
  };
};
