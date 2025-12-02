import { UserRole } from "@/lib/authUtils";
import { IAdmin } from "./admin.interface";
import { ICustomer } from "./customer.interface";

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    admin?: IAdmin;
    customer?: ICustomer;
    createdAt: string;
    updatedAt: string;
}
