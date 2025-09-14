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

export interface Server {
  id: string;
  name: string;
  status: Status;
}
