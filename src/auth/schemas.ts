import * as z from "zod";

// signupのスキーマ
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "ユーザー名を入力してください" })
    .max(10, { message: "ユーザー名は10文字以内で入力してください" }),
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードを6文字以上で入力してください" }),
});
// signupのフォーム値の型
export type SignupFormValues = z.infer<typeof signupSchema>;

// signinのスキーマ
export const signinSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードを6文字以上で入力してください" }),
});
// signinのフォーム値の型
export type SigninFormValues = z.infer<typeof signinSchema>;
