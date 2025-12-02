export interface ICustomer {
 id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  password: string;
  role: "CUSTOMER" ;
  addresses?: IAddress[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface IAddress {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;

  createdAt: string;
}
