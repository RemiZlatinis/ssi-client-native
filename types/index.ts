export type Status = "OK" | "UPDATE" | "WARNING" | "FAILURE" | "ERROR" | null;

export interface Server {
  id: string;
  name: string;
  status: Status;
}
