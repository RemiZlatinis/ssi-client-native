export type Status = "OK" | "UPDATE" | "WARNING" | "FAILURE" | "ERROR" | null;

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: string | null;
}

export interface AuthObject {
  access: string;
  refresh: string;
  user: User;
}

export interface AgentService {
  name: string;
  description?: string;
  version?: string;
  schedule?: string;
  last_status: Status;
  last_message?: string;
  last_seen?: Date;
}

export interface Agent {
  id: string;
  name: string;
  is_online: boolean;
  services: AgentService[];
}
