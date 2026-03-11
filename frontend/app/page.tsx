import { redirect } from "next/navigation";

export default async function RootPage() {
  // TODO: auth token
  const isLoggedIn = false;
  redirect(isLoggedIn ? "/dashboard" : "/login");
}
