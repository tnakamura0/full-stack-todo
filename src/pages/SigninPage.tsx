import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signinSchema, type SigninFormValues } from "@/auth/schemas";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { authRepository } from "@/modules/auth/auth.repository";
import { useCurrentUser } from "@/modules/auth/current-user.state";

export default function SigninPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const currentUserStore = useCurrentUser();

  const signin = async (data: SigninFormValues) => {
    try {
      const user = await authRepository.signin(data.email, data.password);
      console.log("User signed in successfully:", user);
      currentUserStore.set(user);
    } catch (error) {
      console.error("Error signing in:", error);
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
      onSubmit={handleSubmit(signin)}
      className="min-h-screen flex items-start justify-center p-4 pt-16"
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>サインイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してください
          </CardDescription>
          <CardAction>
            <Link to={"/signup"}>
              <Button type="button" variant="link">
                新規登録
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500/80">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  パスワードを忘れましたか？
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500/80">{errors.password.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            サインイン
          </Button>
          <Button type="button" variant="outline" className="w-full">
            <FcGoogle />
            Googleでサインイン
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
