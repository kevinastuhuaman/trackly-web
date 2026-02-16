import { Badge } from "@/components/ui/badge";

function colorForScore(score: number) {
  if (score >= 80) return "text-success border-success/50 bg-success/10";
  if (score >= 65) return "text-cyan-400 border-cyan-500/50 bg-cyan-500/10";
  if (score >= 50) return "text-warning border-warning/50 bg-warning/10";
  return "text-error border-error/50 bg-error/10";
}

export function MatchScore({ score, reasons, missing }: { score?: number | null; reasons?: string[] | null; missing?: string[] | null }) {
  if (typeof score !== "number") return null;

  return (
    <div className="space-y-2">
      <Badge className={colorForScore(score)}>Match {score}</Badge>
      {!!reasons?.length && (
        <div className="flex flex-wrap gap-1">
          {reasons.slice(0, 5).map((reason) => (
            <Badge key={reason} className="border-success/50 bg-success/10 text-success">
              {reason}
            </Badge>
          ))}
        </div>
      )}
      {!!missing?.length && (
        <div className="flex flex-wrap gap-1">
          {missing.slice(0, 5).map((skill) => (
            <Badge key={skill} className="border-warning/50 bg-warning/10 text-warning">
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
