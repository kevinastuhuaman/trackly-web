import { API_BASE_URL } from "@/lib/constants";
import { readToken } from "@/lib/auth";
import type {
  AuthResponse,
  BasicResponse,
  CompaniesResponse,
  Job,
  JobAction,
  JobsQuery,
  JobsResponse,
  MeResponse,
  MetricsResponse,
  PreferencesPayload,
  Profile,
  ProfileResponse,
  SubscriptionStatus,
  TrackerFocusResponse,
  TrackerJobsResponse,
  TrackerStageApi,
} from "@/lib/types";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
  signal?: AbortSignal;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? readToken();
  const headers = new Headers(options.headers);

  if (!options.isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body
      ? options.isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body)
      : undefined,
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = `HTTP ${response.status}`;
    let code: string | undefined;

    try {
      if (contentType.includes("application/json")) {
        const json = (await response.json()) as { error?: string; message?: string; code?: string };
        message = json.error || json.message || message;
        code = json.code;
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // ignore parsing failures
    }

    throw new ApiError(response.status, message, code);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.blob()) as T;
}

export async function authenticateWithMobile(provider: "google" | "apple", idToken: string) {
  const body = {
    provider,
    token: idToken,
    idToken,
    platform: "web",
  };

  const raw = await request<AuthResponse>("/auth/mobile", {
    method: "POST",
    body,
    token: null,
  });

  return normalizeAuthResponse(raw);
}

function normalizeAuthResponse(raw: AuthResponse): AuthResponse {
  if (raw.success && raw.token) return raw;
  if ((raw as unknown as { jwt?: string }).jwt) {
    return {
      success: true,
      token: (raw as unknown as { jwt: string }).jwt,
      user: raw.user,
    };
  }
  return raw;
}

export async function getCurrentUser() {
  return request<MeResponse>("/jobscout/me");
}

export async function getJobs(query: JobsQuery = {}) {
  const params = new URLSearchParams();
  if (query.jobFunction?.length) params.set("jobFunction", query.jobFunction.join(","));
  if (query.locationFilter !== undefined) params.set("locationFilter", query.locationFilter);
  if (query.jobModality) params.set("jobModality", query.jobModality);
  if (query.needsSponsorship !== undefined) params.set("needsSponsorship", String(query.needsSponsorship));
  if (query.status && query.status !== "all") params.set("status", query.status);
  if (query.sort) params.set("sort", query.sort);
  if (query.companyId) params.set("companyId", String(query.companyId));
  if (query.search) params.set("search", query.search);
  params.set("limit", String(query.limit ?? 50));
  params.set("offset", String(query.offset ?? 0));

  return request<JobsResponse>(`/jobscout/jobs?${params.toString()}`);
}

export async function getJobDetail(id: number) {
  return request<Job>(`/jobscout/jobs/${id}`);
}

export async function postJobAction(id: number, action: JobAction) {
  return request<BasicResponse>(`/jobscout/jobs/${id}/action`, {
    method: "POST",
    body: { action },
  });
}

export async function markJobOpened(id: number) {
  return request<BasicResponse>(`/jobscout/jobs/${id}/opened`, {
    method: "POST",
    body: { source: "web_feed" },
  });
}

export async function updatePreferences(payload: PreferencesPayload) {
  return request<BasicResponse>("/jobscout/preferences", {
    method: "PUT",
    body: payload,
  });
}

export async function getCompanies(locationFilter?: string, jobModality?: string) {
  const params = new URLSearchParams();
  if (locationFilter) params.set("locationFilter", locationFilter);
  if (jobModality) params.set("jobModality", jobModality);

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<CompaniesResponse>(`/jobscout/companies${suffix}`);
}

export async function getMetrics() {
  return request<MetricsResponse>("/jobscout/metrics");
}

export async function getTrackerSummary() {
  return request<{ stages?: Record<string, number>; totalTracked?: number; dueReminders?: number; overdueReminders?: number }>(
    "/jobscout/tracker/summary"
  );
}

export async function getTrackerJobs(stage: TrackerStageApi = "all", limit = 50, offset = 0) {
  const params = new URLSearchParams({ stage, limit: String(limit), offset: String(offset), sort: "updated_desc" });
  return request<TrackerJobsResponse>(`/jobscout/tracker/jobs?${params.toString()}`);
}

export async function getTrackerFocus() {
  return request<TrackerFocusResponse>("/jobscout/tracker/focus?limit=40");
}

export async function moveTrackerStage(jobId: number, stage: TrackerStageApi) {
  return request<BasicResponse>(`/jobscout/tracker/jobs/${jobId}/stage`, {
    method: "POST",
    body: { stage },
  });
}

export async function createTrackerNote(jobId: number, noteText: string) {
  return request<BasicResponse>(`/jobscout/tracker/jobs/${jobId}/note`, {
    method: "POST",
    body: { noteText },
  });
}

export async function createTrackerReminder(jobId: number, dueAt: string, title?: string) {
  return request<BasicResponse>(`/jobscout/tracker/jobs/${jobId}/reminders`, {
    method: "POST",
    body: { dueAt, title },
  });
}

export async function getProfile() {
  return request<ProfileResponse>("/jobscout/profile");
}

export async function updateProfile(payload: Partial<Profile>) {
  return request<BasicResponse>("/jobscout/profile", {
    method: "PUT",
    body: payload,
  });
}

export async function uploadResume(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData();
  formData.append("file", file);

  const token = readToken();

  return new Promise<BasicResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/jobscout/resume`);
    xhr.timeout = 60_000;

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      const progress = Math.min(100, Math.round((event.loaded / event.total) * 100));
      onProgress(progress);
    };

    xhr.onerror = () => {
      reject(new ApiError(0, "Unable to upload resume. Check your connection and retry."));
    };

    xhr.ontimeout = () => {
      reject(new ApiError(408, "Resume upload timed out. Please retry."));
    };

    xhr.onload = () => {
      const contentType = xhr.getResponseHeader("content-type") || "";
      const text = xhr.responseText || "";

      if (xhr.status >= 200 && xhr.status < 300) {
        if (!text) {
          resolve({ success: true });
          return;
        }

        if (contentType.includes("application/json")) {
          try {
            resolve(JSON.parse(text) as BasicResponse);
            return;
          } catch {
            resolve({ success: true });
            return;
          }
        }

        resolve({ success: true });
        return;
      }

      let message = `HTTP ${xhr.status}`;
      let code: string | undefined;

      if (text) {
        try {
          const json = JSON.parse(text) as { error?: string; message?: string; code?: string };
          message = json.error || json.message || message;
          code = json.code;
        } catch {
          message = text;
        }
      }

      reject(new ApiError(xhr.status, message, code));
    };

    xhr.send(formData);
  });
}

export async function deleteResume() {
  return request<BasicResponse>("/jobscout/resume", {
    method: "DELETE",
  });
}

export async function getSubscriptionStatus() {
  return request<SubscriptionStatus>("/jobscout/subscription/status");
}
