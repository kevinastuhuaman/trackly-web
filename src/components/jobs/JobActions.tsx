import type { Job, JobAction } from "@/lib/types";
import { Button } from "@/components/ui/button";

function actionSet(status: Job["userStatus"]) {
  if (status === "applying") return ["confirm_applied", "check_later", "undo"] as JobAction[];
  if (status === "applied_confirmed") return ["undo"] as JobAction[];
  if (status === "check_later") return ["apply_now", "not_interested", "undo"] as JobAction[];
  if (status === "not_interested") return ["undo"] as JobAction[];
  return ["apply_now", "check_later", "not_interested"] as JobAction[];
}

function labelForAction(action: JobAction) {
  switch (action) {
    case "apply_now":
      return "Apply Now";
    case "confirm_applied":
      return "Confirm Applied";
    case "check_later":
      return "Check Later";
    case "not_interested":
      return "Not Interested";
    case "undo":
      return "Undo";
    default:
      return action;
  }
}

export function JobActions({ job, onAction }: { job: Job; onAction: (action: JobAction) => void }) {
  const actions = actionSet(job.userStatus ?? null);

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action}
          variant={action === "not_interested" ? "danger" : action === "undo" ? "secondary" : "primary"}
          size="sm"
          onClick={() => onAction(action)}
        >
          {labelForAction(action)}
        </Button>
      ))}
    </div>
  );
}
