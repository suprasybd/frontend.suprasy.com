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
  StartDate: string;
  EndDate: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface BalanceResponseType {
  Id: number;
  Balance: number;
  UserId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PlanResponseType {
  Id: number;
  MonthlyCharge: number;
  CreatedAt: string;
  UpdatedAt: string;
}
