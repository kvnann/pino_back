import { Body, Controller, Get, Post, Put, Query, Req, Res } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Response } from "express";
import { TCreateAdmin } from "./types/TCreateAdmin";
import { TUpdateAdmin } from "./types/TUpdateAdmin";

@Controller('admin')
export class AdminController{
    constructor(
        private readonly adminService: AdminService
    ){}

    @Post("")
    async createAdmin(
        @Req() req:any,
        @Res() res: Response,
        @Body() adminDetails: TCreateAdmin
    ){
        return await this.adminService.createAdmin(adminDetails, req, res);
    }

    @Get("check-authority")
    async checkAdminAuthority(
        @Req() req:any,
        @Res() res: Response
    ){
        return await this.adminService.checkAdminAuthority(req, res);
    }

    @Get("")
    async getAdmin(
        @Req() req:any,
        @Res() res: Response,
    ){
        return await this.adminService.getAdmin(req.query.adminID, req, res);
    }

    @Put("")
    async updateAdmin(
        @Req() req:any,
        @Res() res: Response,
        @Body() body: TUpdateAdmin
    ){
        return await this.adminService.updateAdmin(body, req, res);
    }
    
    @Post("login")
    async loginAdmin(
        @Res() res: Response,
        @Body() adminDetails: TAdminLogin
    ){
        return await this.adminService.adminLogin(adminDetails, res);
    }
}