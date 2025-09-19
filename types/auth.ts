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
