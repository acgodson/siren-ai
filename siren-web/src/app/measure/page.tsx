import Dashboard from "@/lib/Dashboard.tsx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default function Map() {
  // Extract headers and cookies
  const headersList = headers();
  const cookieStore = cookies();

  // Retrieve relevant values
  const host = headersList.get("host")?.split(".")[0] ?? "";

  return <Dashboard />;
}
