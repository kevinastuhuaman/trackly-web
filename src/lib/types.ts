export type AuthProvider = "google" | "apple";

export type JobFunction =
  | "product"
  | "engineering"
  | "design"
  | "data"
  | "marketing"
  | "sales"
  | "partnerships"
  | "finance"
  | "strategy"
  | "operations"
  | "people"
  | "other";

export type JobUserStatus =
  | "new"
  | "applying"
  | "applied_confirmed"
  | "check_later"
  | "not_interested";

export type JobAction = "apply_now" | "confirm_applied" | "check_later" | "not_interested" | "undo";

export type LocationFilter = "us" | "non_us" | "";
export type JobModality = "full_time" | "internship" | "all";

export type TrackerStageApi = "all" | "backlog" | "in_progress" | "applied" | "offers" | "discarded";

export interface User {
  id: number;
  email: string;
  name: string;
  photoUrl?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface Job {
  id: number;
  externalId?: string;
  title: string;
  companyName: string;
  companyId: number;
  companyDomain?: string | null;
  companyAtsType?: string | null;
  location?: string | null;
  jobUrl: string;
  jobFunction: JobFunction;
  postedAt?: string | null;
  firstSeenAt?: string | null;
  atsSource?: string | null;
  sponsorshipStatus?: "yes" | "no" | "unknown" | null;
  sponsorshipEvidence?: string | null;
  descriptionText?: string | null;
  descriptionHtml?: string | null;
  userStatus?: JobUserStatus | null;
  applyStartedAt?: string | null;
  appliedConfirmedAt?: string | null;
  statusUpdatedAt?: string | null;
  matchScore?: number | null;
  matchLabel?: string | null;
  matchReasons?: string[] | null;
  missingSkills?: string[] | null;
  isNew?: boolean;
  timeToApplyMinutes?: number | null;
  workflowSignalSupported?: boolean;
  connections?: Connection[];
  hiringManagers?: HiringManager[];
}

export interface Connection {
  name: string;
  title?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
  engagementStatus?: string | null;
}

export interface HiringManager {
  name: string;
  title?: string | null;
  email?: string | null;
  linkedinUrl?: string | null;
}

export interface JobsResponse {
  success: boolean;
  jobs: Job[];
  total: number;
  hasMore: boolean;
}

export interface JobsQuery {
  jobFunction?: string[];
  locationFilter?: LocationFilter;
  jobModality?: JobModality;
  needsSponsorship?: boolean;
  status?: string;
  sort?: "newest" | "match";
  companyId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface BasicResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export interface MeResponse {
  user: User & {
    preferences: {
      wantsPm?: boolean;
      wantsStrategyOps?: boolean;
      wantsPartnerships?: boolean;
      wantedJobFunctions?: JobFunction[];
      locationFilter?: LocationFilter;
      needsSponsorship?: boolean;
      jobModality?: JobModality;
      experienceRange?: string | null;
    };
    onboardingCompleted?: boolean;
    workflowSignalDevEnabled?: boolean;
  };
  hasResume?: boolean;
  resumeSummary?: ResumeSummary | null;
}

export interface Company {
  id: number;
  name: string;
  domain?: string | null;
  atsType?: string | null;
  jobCount?: number;
  pmJobCount?: number;
  internshipCount?: number;
  mbaCount?: number;
}

export interface CompaniesResponse {
  companies: Company[];
}

export interface MetricsResponse {
  totalJobs: number;
  mbaJobs: number;
  internships: number;
  mbaInternships: number;
  byFunction: Record<string, number>;
  byModality: Record<string, number>;
}

export interface PreferencesPayload {
  wantedJobFunctions: JobFunction[];
  locationFilter: LocationFilter;
  needsSponsorship: boolean;
  jobModality: JobModality;
  experienceRange?: string | null;
}

export interface Education {
  school?: string;
  degree?: string;
  fieldOfStudy?: string;
  gpa?: string;
  graduationYear?: string;
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pronouns?: string;
  currentCompany?: string;
  currentTitle?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  legallyAuthorized?: boolean;
  requiresSponsorship?: boolean;
  visaType?: string;
  education?: Education[];
  salaryMin?: number;
  salaryMax?: number;
  earliestStartDate?: string;
  workArrangement?: string;
  willingToRelocate?: boolean;
  gender?: string;
  raceEthnicity?: string;
  veteranStatus?: string;
  disabilityStatus?: string;
}

export interface ProfileResponse {
  profile?: Profile;
  success?: boolean;
}

export interface ResumeSummary {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface SubscriptionStatus {
  active: boolean;
  plan?: string | null;
  expiresAt?: string | null;
}

export interface TrackerSummary {
  stages: {
    backlog?: number;
    inProgress?: number;
    in_progress?: number;
    applied?: number;
    offers?: number;
    discarded?: number;
  };
  totalTracked?: number;
  dueReminders?: number;
  overdueReminders?: number;
}

export interface TrackerNote {
  id: number;
  noteText: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackerReminder {
  id: number;
  title?: string;
  dueAt?: string;
  status?: string;
  snoozedUntil?: string;
}

export interface TrackerTimelineItem {
  id?: number;
  type?: string;
  message?: string;
  createdAt?: string;
}

export interface TrackerJob extends Job {
  trackerStage?: TrackerStageApi;
  notes?: TrackerNote[];
  reminders?: TrackerReminder[];
  timeline?: TrackerTimelineItem[];
}

export interface TrackerJobsResponse {
  success: boolean;
  jobs: TrackerJob[];
  total?: number;
  hasMore?: boolean;
  error?: string;
}

export interface TrackerFocusResponse {
  success: boolean;
  items?: TrackerJob[];
  dueReminders?: TrackerJob[];
  needsAction?: TrackerJob[];
  staleApplications?: TrackerJob[];
  total?: number;
  error?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

export type LandingJobFunction = JobFunction | "all";

export interface LandingMetrics {
  totalJobs: number;
  totalCompanies: number;
  atsTypes: number;
  mbaJobs: number;
  internships: number;
  updatedCadenceMinutes: number;
}

export interface PublicLandingJob {
  id: string;
  companyName: string;
  companyDomain: string | null;
  title: string;
  location: string;
  postedAt: string;
  jobFunction: JobFunction;
  tags: string[];
}

export interface LandingJobsSnapshot {
  jobs: PublicLandingJob[];
  totalsByFunction: Record<LandingJobFunction, number>;
}

export interface CompanyShowcaseItem {
  name: string;
  domain: string | null;
  jobCount: number;
}

export interface LandingCompaniesSnapshot {
  featured: CompanyShowcaseItem[];
  totalCompanies: number;
  atsTypes: number;
}
