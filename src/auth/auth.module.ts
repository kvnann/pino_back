import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UtilsModule } from "src/utils/utils.module";
import { TokenModule } from "src/token/token.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/typeorm/entities/AdminEntity";

@Module({
    imports:[
        UtilsModule,
        TokenModule,
        TypeOrmModule.forFeature([Admin])
    ],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{}