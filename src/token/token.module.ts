import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "src/typeorm/entities/AdminEntity";
import { UtilsModule } from "src/utils/utils.module";

@Module({
    imports:[
        UtilsModule,
        JwtModule.register({
            global: true
        }),
        TypeOrmModule.forFeature([Admin])
    ],
    providers:[TokenService],
    exports:[TokenService]
})
export class TokenModule{}