export type CoffeeType =
  | 'espresso'
  | 'americano'
  | 'latte'
  | 'cappuccino'
  | 'flat_white'
  | 'drip'
  | 'other';

export const COFFEE_TYPES: { value: CoffeeType; label: string }[] = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'americano', label: 'Americano' },
  { value: 'latte', label: 'Latte' },
  { value: 'cappuccino', label: 'Cappuccino' },
  { value: 'flat_white', label: 'Flat White' },
  { value: 'drip', label: 'Drip Coffee' },
  { value: 'other', label: 'Other' }
];

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  name: string;
  created_at: Date;
}

export interface UserTeam {
  user_id: string;
  team_id: string;
  joined_at: Date;
}

export interface Sprint {
  id: string;
  team_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
}

export interface CoffeeLog {
  id: string;
  user_id: string;
  sprint_id: string;
  team_id: string;
  coffee_type: CoffeeType;
  cup_count: number;
  logged_at: Date;
  created_at: Date;
}

export interface CoffeeLogWithUser extends CoffeeLog {
  user_name: string;
  user_avatar_url: string | null;
}

export interface SprintSummary {
  sprint_id: string;
  sprint_name: string;
  team_id: string;
  team_name: string;
  total_cups: number;
  log_count: number;
}

export interface UserSprintStats {
  user_id: string;
  user_name: string;
  user_avatar_url: string | null;
  total_cups: number;
  coffee_type: CoffeeType;
}
