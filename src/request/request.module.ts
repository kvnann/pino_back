import { Module } from "@nestjs/common";
import { RequestController } from "./request.controller";
import { RequestService } from "./request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestEntity } from "src/typeorm/entities/RequestEntity";
import { UtilsModule } from "src/utils/utils.module";

@Module({
    imports:[
        UtilsModule,
        TypeOrmModule.forFeature([RequestEntity])
    ],
    controllers:[RequestController],
    providers:[RequestService]
})
export class RequestModule{}