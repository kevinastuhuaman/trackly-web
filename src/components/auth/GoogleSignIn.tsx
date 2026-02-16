import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleSignIn() {
  return (
    <a href="/api/auth/google" className="w-full">
      <Button variant="primary" size="lg" className="w-full gap-2">
        <Chrome className="h-4 w-4" />
        Sign in with Google
      </Button>
    </a>
  );
}
