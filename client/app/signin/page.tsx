"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "@/api/Auth";
import Button from "../common/Button"; // Import Button
import Input from "../common/Input"; // Import Input

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

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          className="mb-2"
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // Clear error on change
          }}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          className="mb-2"
          onChange={(e) => {
            setPassword(e.target.value);
            setError(""); // Clear error on change
          }}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-1 text-white rounded cursor-pointer"
          value="Sign In"
        />

        <p className="text-center">
          If you don't have an account,{" "}
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
