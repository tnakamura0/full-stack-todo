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
import { useState } from "react";

import type { Todo, TodoDisplay } from "./todoTypes";
import TodoList from "./TodoList";

export default function TodoPage() {
  const [text, setText] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]); // todos[ { id: string; text: string; isCompleted: boolean} ]
  const [display, setDisplay] = useState<TodoDisplay>("all");

  const handleClick = () => {
    if (text.trim() === "") return;
    setTodos([
      ...todos,
      { id: Date.now().toString(), text, isCompleted: false },
    ]);
    setText("");
  };

  const handleDisplay = (value: TodoDisplay) => {
    setDisplay(value);
    console.log("Display changed to:", value);
  };

  const handleIsCompletedChange = (id: string, checked: boolean) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: checked } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    const deletedTodos = todos.filter((todo) => todo.id != id);
    setTodos(deletedTodos);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-cyan-600/80 text-center">
          Todoリスト
        </h1>
        <div className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="タスクを入力..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" variant="cyan" onClick={handleClick}>
            追加
          </Button>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div>タスク表示切り替え</div>
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
        <TodoList
          todos={todos}
          handleIsCompletedChange={handleIsCompletedChange}
          handleDelete={handleDelete}
          display={display}
        />
      </div>
    </div>
  );
}
