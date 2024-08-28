import Dashboard from "@/lib/Measurement";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
      return redirect("/home");
    }
    revalidatePath("/");
    redirect("/");
  }

  return <Dashboard />;
}
