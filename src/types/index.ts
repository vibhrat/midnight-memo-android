
export interface CasualNote {
  id: string;
  title: string;
  tag: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isBlurred: boolean;
  reminder?: string; // ISO string for reminder time
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
  reminder?: string; // ISO string for reminder time
}

export interface PasswordField {
  id: string;
  title: string;
  password: string;
}

export interface Password {
  id: string;
  title: string;
  password: string;
  fields: PasswordField[];
  createdAt: Date;
  updatedAt: Date;
}
