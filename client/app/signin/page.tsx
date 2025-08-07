"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "@/api/Auth";

export default function SigninPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signin({ email, password });
      if (res.result) {
        window.localStorage.setItem("token", res.token);
        window.localStorage.setItem("user", email);
        router.push("/todo");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value), setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value), setError("");
          }}
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Sign In
        </button>
        <p className="text-center">
          If you don't have account,{" "}
          <button
            className="pt-2 cursor-pointer hover:text-blue-400"
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign up
          </button>{" "}
        </p>
      </form>
    </div>
  );
}
