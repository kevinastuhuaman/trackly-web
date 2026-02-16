import Image from "next/image";
import { getCompanyLogoUrl, makeInitials } from "@/lib/utils";

export function CompanyLogo({
  companyName,
  companyDomain,
  size = 40,
}: {
  companyName: string;
  companyDomain?: string | null;
  size?: number;
}) {
  const logoUrl = getCompanyLogoUrl(companyDomain);

  if (!logoUrl) {
    return (
      <div
        className="grid shrink-0 place-items-center rounded-full bg-accent/20 font-semibold text-accent"
        style={{ width: size, height: size }}
      >
        {makeInitials(companyName)}
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={`${companyName} logo`}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-borderColor bg-backgroundSecondary"
      unoptimized={false}
    />
  );
}
