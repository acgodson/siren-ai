import Dashboard from "@/lib/Dashboard.tsx";
import Welcome from "@/lib/Welcome";
import { cookies, headers } from "next/headers";

export default function App() {
  // Extract headers and cookies
  const headersList = headers();
  const cookieStore = cookies();

  // Retrieve relevant values
  const host = headersList.get("host")?.split(".")[0] ?? "";
  const authToken = cookieStore.get("privy-token");
  const sessionToken = cookieStore.get("privy-session");

  // Authentication logic
  const isAuthenticated = Boolean(authToken);
  const isPartiallyAuthenticated = Boolean(sessionToken);

  // Determine authentication state
  if (!isAuthenticated) {
    if (!isPartiallyAuthenticated) {
      return <Welcome />;
    }
  }

  // Conditional rendering based on the host
  const isAppHost = host === "app";
  return isAppHost ? <Dashboard /> : <Welcome />;
}
