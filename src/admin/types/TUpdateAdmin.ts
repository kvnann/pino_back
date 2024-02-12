import { Admin } from "src/typeorm/entities/AdminEntity";

export type TUpdateAdmin = {
    adminID: string;
    body: Partial<Admin>;
}