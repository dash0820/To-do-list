"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPassword } from "@/lib/validation/authValidation";
import { signup } from "@/api/Auth";
import Button from "../common/Button"; // Import Button
import Input from "../common/Input"; // Import Input

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setErrorEmail("Invalid email format");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorPassword("8+ characters, 1 capital, 1 number, 1 special");
      return;
    }

    setErrorEmail("");
    setErrorPassword("");
    try {
      const res = await signup({ email, password });
      if (res.result) {
        router.push("/signin");
      }
    } catch (err: any) {
      setErrorPassword(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <Input
          placeholder="Email"
          type="email"
          name="email"
          value={email}
          className="mb-2"
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorEmail(""); // Clear error on change
          }}
        />
        {errorEmail && (
          <p className="text-red-500 text-sm mb-4">{errorEmail}</p>
        )}

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          className="mb-2"
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorPassword(""); // Clear error on change
          }}
        />
        {errorPassword && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorPassword}
          </p>
        )}

        <input
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 py-1 text-white rounded cursor-pointer "
          value="Sign Up"
        />

        <p className="text-center">
          Already have an account,{" "}
          <button
            className="pt-2 cursor-pointer hover:text-green-500"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign in
          </button>{" "}
        </p>
      </form>
    </div>
  );
}
