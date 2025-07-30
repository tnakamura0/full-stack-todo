import { supabase } from "@/lib/supabase";

export const todoRepository = {
  async createTodo(userId: string, text: string) {
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          user_id: userId,
          text,
        },
      ])
      .select()
      .single();
    if (error) {
      throw new Error(`Error creating todo: ${error.message}`);
    }
    return data;
  },
  async find(userId: string) {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(`Error fetching todos: ${error.message}`);
    }
    return data;
  },
  async updateTodo(todoId: number, isCompleted: boolean) {
    const { error } = await supabase
      .from("todos")
      .update({ isCompleted })
      .eq("id", todoId);
    if (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  },
  async deleteTodo(todoId: number) {
    await supabase.from("todos").delete().eq("id", todoId);
  },
};
