import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { TodoDisplay } from "./todoTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/modules/todos/todo.state";
import type { Todo } from "@/modules/todos/todo.entity";
import { useCurrentUser } from "@/modules/auth/current-user.state";
import { useEffect, useState } from "react";
import { todoRepository } from "@/modules/todos/todo.repository";

export default function TodoList({ display }: { display: TodoDisplay }) {
  const currentUserStore = useCurrentUser();
  const todoStore = useTodoStore();
  const [isLoading, setIsLoading] = useState(false);
  const todos = todoStore.getAll();

  const filteredTodos = todos.filter((todo: Todo) => {
    if (display === "all") return true;
    if (display === "incomplete") return !todo.isCompleted;
    if (display === "completed") return todo.isCompleted;
  });

  const handleIsCompletedChange = async (id: number, checked: boolean) => {
    todoStore.isCompleteChange(id, checked);

    // すぐにデータベースを更新
    try {
      await todoRepository.updateTodo(id, checked);
      console.log(`Updated todo ${id} to ${checked}`);
    } catch (error) {
      console.error("Error updating todo:", error);
      // エラーが発生した場合、変更を元に戻す
      todoStore.isCompleteChange(id, !checked);
    }
  };

  const handleDelete = (id: number) => {
    todoStore.remove(id);
    todoRepository.deleteTodo(id);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUserStore.currentUser) {
        return;
      }

      setIsLoading(true);

      try {
        const todos = await todoRepository.find(
          currentUserStore.currentUser.id
        );
        if (todos) {
          todoStore.set(todos);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="list-disc list-outside pl-5">
      {filteredTodos.map((todo: Todo) => {
        return (
          <li
            key={todo.id}
            className="w-full p-0.5 border-b-cyan-700/60 border-b-1 border-dashed marker:text-cyan-700/60 marker:text-lg"
          >
            <div className="flex justify-between items-center">
              <span
                className={todo.isCompleted ? "line-through text-gray-500" : ""}
              >
                {todo.text}
              </span>
              <div>
                <Checkbox
                  id={`todo-${todo.id}-checkbox`}
                  checked={todo.isCompleted}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                      handleIsCompletedChange(todo.id, checked);
                    }
                  }}
                />
                <div className="ml-2 inline-flex items-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">削除</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認</AlertDialogTitle>
                        <AlertDialogDescription>
                          タスクを削除しますか？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(todo.id)}
                        >
                          削除する
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
