export interface StoreType {
  Id: number;
  StoreKey: string;
  StoreName: string;
  SubDomain: string;
  StoreCloudName: string;
  IsActive: boolean;
  DomainName: string;
  UserId: number;
  ThemeId: number;
  ThemeVersionId: number;
  CreatedAt: string;
  Status: string;
  UpdatedAt: string;
}

export interface SubscriptionType {
  Id: number;
  StoreKey: string;
  PlanId: number;
  StartDate: string;
  EndDate: string | null;
  AutoRenew: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SubscriptionResponseType {
  Success: boolean;
  Message: string;
  Data: SubscriptionType;
}

export interface BalanceResponseType {
  Id: number;
  Balance: number;
  UserId: number;
  IsTrial: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PlanType {
  Id: number;
  Name: string;
  MonthlyPrice: number;
  Features: string; // JSON string of features array
}

export interface PlanResponseType {
  Success: boolean;
  Message: string;
  Data: PlanType[];
}

export interface TransactionType {
  Id: number;
  Type: 'CREDIT' | 'DEBIT';
  Amount: number;
  UserId: number;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TransactionResponseType {
  Success: boolean;
  Message: string;
  Data: TransactionType[];
  Pagination?: {
    TotalPages: number;
    Page: number;
    TotalItems: number;
    Limit: number;
  };
}
