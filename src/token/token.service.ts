import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminController } from "src/admin/admin.controller";
import { Admin } from "src/typeorm/entities/AdminEntity";
import { UtilsService } from "src/utils/utils.service";
import { Repository } from "typeorm";

type UserToken = {
    id:number;
    username:string;
}

type AdminToken = {
    id:number;
    adminID:string;
}

@Injectable()
export class TokenService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly utils: UtilsService,
        @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    ){}

    async signToken(userToken:UserToken):Promise<string>{
        const payload = { sub:userToken.id, username:userToken.username };
        return await this.jwtService.signAsync(payload,{
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m'
        });
    }
    async signAdminToken(adminToken:AdminToken):Promise<string>{
        const payload = { sub:adminToken.id, adminID:adminToken.adminID };
        return await this.jwtService.signAsync(payload,{
            secret: process.env.JWT_ADMIN_SECRET,
            expiresIn: '1h'
        });
    }
    async signRefreshToken(userToken:UserToken):Promise<string>{
        const payload = { sub:userToken.id, username:userToken.username, refresh:true };
        return await this.jwtService.signAsync(payload,{
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '30d'
        });
    }
    async verifyToken(token:string):Promise<UserToken>{
        try{
            return await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_SECRET
            });
        }catch(e){
            return null;
        }
    }
    async verifyAdminToken(token:string):Promise<AdminToken | null>{
        try{
            const verified = await this.jwtService.verifyAsync<AdminToken>(token, {
                secret: process.env.JWT_ADMIN_SECRET
            });
            if(!verified){
                return null;
            }
            const adminData = await this.adminRepo.findOne({
                where:{
                    adminID: verified.adminID
                }
            });
            if(adminData.accessToken !== await this.utils.hashToken(token)){
                return null;
            }
            return adminData;
        }catch(e){
            return null;
        }
    }
    async verifyRefreshToken(token:string):Promise<UserToken>{
        return await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_REFRESH_SECRET
        });
    }
}