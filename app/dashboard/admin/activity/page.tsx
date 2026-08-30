import { redirect } from "next/navigation";

export default function ActivityHomePage() {
  redirect("/dashboard/admin/activity/list");
}
