import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface AuthButtonsProps {}

interface SessionWithId extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string; // 添加 user.id 的类型
  };
}

export default function AuthButtons({}: AuthButtonsProps) {
  const { data: session, status } = useSession() as { data: SessionWithId | null, status: 'authenticated' | 'unauthenticated' | 'loading' };
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => signIn('google')}
    >
      Sign In with Google
    </button>
  );
}

