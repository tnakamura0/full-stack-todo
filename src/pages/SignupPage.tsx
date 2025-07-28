import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/auth/schemas";
import type { SignupFormValues } from "@/auth/schemas";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authRepository } from "@/modules/auth/auth.repository";
import { useCurrentUser } from "@/modules/auth/current-user.state";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const currentUserStore = useCurrentUser();

  const signup = async () => {
    try {
      const user = await authRepository.signup(name, email, password);
      console.log("User signed up successfully:", user);
      currentUserStore.set(user);
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error appropriately, e.g., show a notification or alert
    }
  };

  // 以下useEffectまでリダイレクト処理
  const navigate = useNavigate();

  // useEffectでレンダリング完了後にリダイレクトが実行されるようにする
  useEffect(() => {
    if (currentUserStore.currentUser) {
      navigate("/");
    }
  }, [currentUserStore.currentUser, navigate]);

  return (
    <form
      onSubmit={handleSubmit(signup)}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>サインアップ</CardTitle>
          <CardDescription>
            新規登録するには下記の項目を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">ユーザー名</Label>
              <Input
                id="name"
                type="text"
                placeholder="ユーザー名を入力..."
                required
                {...register("name")}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500/80">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500/80">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500/80">{errors.password.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            登録する
          </Button>
          <Button variant="outline" className="w-full">
            <FcGoogle />
            Googleアカウントで登録
          </Button>
          <div className="mt-2 text-center text-sm">
            既にアカウントをお持ちですか？
            <Link to="/signin" className="underline underline-offset-4">
              サインイン
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
