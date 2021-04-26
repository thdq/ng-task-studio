import { environment } from "@/environments/environment"

export const makeApiUrl = (path: string): string => `${environment.apiUrl}${path}`
