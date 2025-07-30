import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { TodoDisplay } from "./todoTypes";
import TodoList from "./TodoList";
import { useCurrentUser } from "@/modules/auth/current-user.state";
import { todoRepository } from "@/modules/todos/todo.repository";
import { useTodoStore } from "@/modules/todos/todo.state";

export default function TodoPage() {
  const [text, setText] = useState<string>("");
  const [display, setDisplay] = useState<TodoDisplay>("all");
  const currentUserStore = useCurrentUser();
  const todoStore = useTodoStore();
  const navigate = useNavigate();

  // 認証チェック
  useEffect(() => {
    if (!currentUserStore.currentUser) {
      navigate("/signin");
    }
  }, [currentUserStore.currentUser, navigate]);

  // ログインしていない場合は何も表示しない
  if (!currentUserStore.currentUser) {
    return null;
  }

  const handleDisplay = (value: TodoDisplay) => {
    setDisplay(value);
    console.log("Display changed to:", value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "") return;
    createTodo();
  };

  const createTodo = async () => {
    const newTodo = await todoRepository.createTodo(
      currentUserStore.currentUser!.id,
      text
    );
    todoStore.add(newTodo);
    setText("");
    console.log("New Todo created:", newTodo);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-cyan-500/80 text-center">
          Todoリスト
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <Input
            type="text"
            placeholder="タスクを入力..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" variant="cyan">
            追加
          </Button>
        </form>
        <div className="flex justify-center items-center gap-2">
          {/* <div>表示</div> */}
          <Select
            value={display}
            onValueChange={handleDisplay}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="タスク表示切り替え" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>タスク表示</SelectLabel>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="incomplete">未完了</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <TodoList display={display} />
      </div>
    </div>
  );
}
