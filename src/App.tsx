import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoPage from "./pages/todo/TodoPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { useCurrentUser } from "./modules/auth/current-user.state";
import { authRepository } from "./modules/auth/auth.repository";
import { useEffect, useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentUserStore = useCurrentUser();

  const setSession = async () => {
    try {
      const currentUser = await authRepository.getCurrentSession();
      if (currentUser) {
        currentUserStore.set(currentUser);
      }
    } catch (error) {
      console.error("Error setting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSession();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
