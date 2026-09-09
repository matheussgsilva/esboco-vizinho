import type { JobStatusCode, JobTypeCode, WorkModeCode } from "@/lib/validations/job";

export interface JobRecord {
  id: string;
  title: string;
  description: string;
  type: JobTypeCode;
  workMode: WorkModeCode;
  city: string | null;
  state: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  showSalary: boolean;
  contactEmail: string | null;
  applicationUrl: string | null;
  status: JobStatusCode;
  closesAt: Date;
  expired: boolean;
}
