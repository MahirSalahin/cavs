
import SupabaseLogin from "@/components/SupabaseLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {

  return (
    <section className="flex items-center justify-center container p-4 pt-16">
      <SupabaseLogin />
    </section>
  )
}