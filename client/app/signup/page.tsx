"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPassword } from "@/lib/validation/authValidation";
import { signup } from "@/api/Auth";

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
      setErrorPassword("8+ , 1 capital, 1 number, 1 special");
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

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorPassword("");
    setPassword(e.target.value);
  };

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorEmail("");
    setEmail(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <input
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(event) => emailChange(event)}
          required
        />
        {errorEmail && (
          <p className="text-red-500 text-sm mb-4">{errorEmail}</p>
        )}
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(event) => passwordChange(event)}
        />
        {errorPassword && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorPassword}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        <p className="text-center">
          If you already have account,{" "}
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
