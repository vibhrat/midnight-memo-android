export interface CasualNote {
  id: string;
  title: string;
  tag: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isBlurred?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  checked?: boolean;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordField {
  id: string;
  title: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Password {
  id: string;
  title: string;
  password: string;
  passwordFields?: PasswordField[];
  createdAt: Date;
  updatedAt: Date;
}
