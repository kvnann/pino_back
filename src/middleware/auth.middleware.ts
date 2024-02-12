import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { RolesService } from "src/common/roles/roles.common";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthMiddleWare implements NestMiddleware{
    constructor(
        private readonly tokenService: TokenService,
        private readonly rolesService: RolesService
    ){}
    async use(req: any, res: Response, next: (error?: any) => void) {
        const accessToken = this.extractAuthFromBearer(req.headers['authorization']);
        if(!accessToken) return res.status(HttpStatus.UNAUTHORIZED).send("İdentifkasiya uğursuzdur");
        req.admin = await this.tokenService.verifyAdminToken(accessToken) ?? null;
        if(!req?.user && !req?.admin) return res.status(HttpStatus.UNAUTHORIZED).send("İdentifkasiya uğursuzdur");
        if(!req.user && !this.rolesService.hasAccess(req.url, req.method, req.admin.role)) return res.status(HttpStatus.UNAUTHORIZED).send("Sizin bu sorğuya keçidiniz mədudlaşdırılıb.");
        if(req.user) return next();
        if(req.admin){}
        next();
    }

    extractAuthFromBearer(auth:string){
        if(!auth) return null;
        const [bearerString, tokenString] = auth.split(" ");
        return bearerString === 'Bearer' ? tokenString : null;
    }
    extractAuthFromRefresh(auth:string){
        if(!auth) return null;
        const [refreshString, tokenString] = auth.split(" ");
        return refreshString === 'Refresh' ? tokenString : null;
    }
}