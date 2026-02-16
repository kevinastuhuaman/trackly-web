"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteResume, useUploadResume } from "@/hooks/useProfile";

export function ResumeUpload() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const upload = useUploadResume();
  const remove = useDeleteResume();
  const showProgress = upload.isPending || upload.progress > 0;

  return (
    <div className="space-y-2 rounded-md border border-borderColor bg-backgroundCard p-3">
      <p className="text-sm font-medium">Resume</p>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          upload.mutate(file, {
            onSuccess: () => toast.success("Resume uploaded"),
            onError: () => toast.error("Unable to upload resume"),
          });
          event.currentTarget.value = "";
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" disabled={upload.isPending} onClick={() => fileRef.current?.click()}>
          Upload Resume
        </Button>
        <Button size="sm" variant="secondary" disabled={upload.isPending || remove.isPending} onClick={() => remove.mutate()}>
          Delete Resume
        </Button>
      </div>
      {showProgress && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-textSecondary">
            <span>{upload.isPending ? "Uploading..." : "Upload complete"}</span>
            <span>{upload.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-backgroundSecondary">
            <div
              className="h-2 rounded-full bg-accent transition-[width] duration-200 ease-out"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
