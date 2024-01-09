import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface SignUpPayload {
  First_name: string;
  Last_name: string;
  Email: string;
  Password: string;
  Phone: string;
  User_type?: string;
}

export interface SignUpProps {
  completeForm: SignUpPayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
};

// ---- Sign In Types ----
export interface SignInPayload {
  Email: string;
  Password: string;
  User_type?: string;
}

export interface SignInProps {
  completeForm: SignInPayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<any>>;
  router: AppRouterInstance;
};

export interface LogoutProps {
  router: AppRouterInstance;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
};

// ---- Income Types ----

export interface IncomeProps {
  completeForm: IncomePayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
  setPresentIncome: Dispatch<SetStateAction<any>>;
  setBarChart: Dispatch<SetStateAction<any>>;
};

export interface IncomePayload {
  Source: string;
  Amount: number;
  Description: string;
  User_type?: string;
};

// ---- Password Types ----

export interface PasswordChangeProps {
  completeForm: PasswordPayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
};

export interface PasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// ---- Expense Types ----
export interface ExpenseProps {
  completeForm: ExpensePayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
  setExpenseData: Dispatch<SetStateAction<any>>;
  setTotalExpense: Dispatch<SetStateAction<number>>;
  setBarChart: Dispatch<SetStateAction<any>>;
  setPieChart: Dispatch<SetStateAction<any>>;
  setLineChart: Dispatch<SetStateAction<any>>;
};

export interface ExpensePayload {
  Amount: number;
  Category: string;
  Note: string;
};

export interface UserDetailsProps {
  completeForm: UserDetailsPayload;
  setFormError: Dispatch<SetStateAction<string>>;
  setFormSuccess: Dispatch<SetStateAction<string>>;
  setFormLoading: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<boolean>>;
};

export interface UserDetailsPayload {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  password?: string | null;
  user_type?: string;
  updated_at?: string;
};


export interface CategoryProps {
  input?: string;
  id?: string;
  setFormError: Dispatch<React.SetStateAction<string>>;
  setFormSuccess: Dispatch<React.SetStateAction<string>>;
  setFormLoading: Dispatch<React.SetStateAction<boolean>>;
  setAreaChart: Dispatch<SetStateAction<any>>;
  setPieChart: Dispatch<SetStateAction<any>>;
}
