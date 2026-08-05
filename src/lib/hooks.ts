"use client";

import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

const supabase = createClient();

export function useLogout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    useStore.persist.clearStorage();
    window.location.href = "/";
  };
  return handleLogout;
}
