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
import { Switch } from "@/components/ui/switch";

import type { Todo, TodoDisplay } from "./todoTypes";

export default function TodoList({
  todos,
  handleIsCompletedChange,
  handleDelete,
  display,
}: {
  todos: Todo[];
  handleIsCompletedChange: (id: string, isCompleted: boolean) => void;
  handleDelete: (id: string) => void;
  display: TodoDisplay;
}) {
  const filteredTodos = todos.filter((todo: Todo) => {
    if (display === "all") return true;
    if (display === "incomplete") return !todo.isCompleted;
    if (display === "completed") return todo.isCompleted;
  });

  return (
    <ul className="list-disc list-outside pl-5">
      {filteredTodos.map((todo: Todo) => {
        return (
          <li
            key={todo.id}
            className="w-full p-0.5 border-b-cyan-700/60 border-b-1 border-dashed marker:text-cyan-700/60 marker:text-lg"
          >
            <div className="flex justify-between items-center">
              <span>{todo.text}</span>
              <div>
                <span className="ml-2">
                  {todo.isCompleted ? "完了" : "未完了"}
                </span>
                <Switch
                  id={`todo-${todo.id}`}
                  checked={todo.isCompleted}
                  onCheckedChange={(checked) => {
                    handleIsCompletedChange(todo.id, checked);
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
