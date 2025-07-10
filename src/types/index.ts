
export interface CasualNote {
  id: string;
  title: string;
  tag: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_blurred?: boolean;
  user_id: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  checked?: boolean;
  shopping_list_id: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  items?: ShoppingListItem[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PasswordField {
  id: string;
  title: string;
  password: string;
  password_id: string;
  created_at: string;
  updated_at: string;
}

export interface Password {
  id: string;
  title: string;
  password: string;
  fields?: PasswordField[];
  created_at: string;
  updated_at: string;
  user_id: string;
}
