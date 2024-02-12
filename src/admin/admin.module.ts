import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UtilsModule } from "src/utils/utils.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/typeorm/entities/AdminEntity";
import { CommonModule } from "src/common/common.module";
import { TokenModule } from "src/token/token.module";

@Module({
    imports:[
        UtilsModule,
        CommonModule,
        TokenModule,
        TypeOrmModule.forFeature([Admin])
    ],
    controllers:[AdminController],
    providers:[AdminService]
})
export class AdminModule{}