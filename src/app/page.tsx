import { redirect } from "next/navigation";

export default function RootPage() {
  // Langsung arahkan ke dashboard yang ada di dalam (pages)
  redirect("/dashboard");
}