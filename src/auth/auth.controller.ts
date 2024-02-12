import { Controller, Get, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { UtilsService } from "src/utils/utils.service";
import { TokenService } from "src/token/token.service";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService,
        private readonly utils: UtilsService,
    ){}

    @Get('')
    getAuth(
        @Res() res:Response){
        return res.status(200).json({auth:this.utils.createRandomString(20)});
    }

    @Get('anonym')
    getAnonymID(@Res() res:Response){
        return res.status(200).json({anonymID:this.utils.createRandomString(20)});
    }
}