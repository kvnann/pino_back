import { Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { RolesService } from "./roles/roles.common";

@Module({
    providers:[CommonService, RolesService],
    exports:[CommonService, RolesService]
})
export class CommonModule{}