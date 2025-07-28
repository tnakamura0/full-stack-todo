import { supabase } from "@/lib/supabase";

export const authRepository = {
  async signup(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error !== null || data.user === null) {
      throw new Error(error?.message);
    }
    return {
      ...data.user,
      userName: data.user.user_metadata.name, // nameはuser_metadataに格納されている
    };
  },
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error != null || data.user === null) {
      throw new Error(error?.message);
    }
    return {
      ...data.user,
      userName: data.user.user_metadata.name,
    };
  },
  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  },
};
