import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "src/typeorm/entities/AdminEntity";
import { Repository } from "typeorm";
import { TCreateAdmin } from "./types/TCreateAdmin";
import { Response } from "express";
import { UtilsService } from "src/utils/utils.service";
import { CommonService } from "src/common/common.service";
import { RolesService } from "src/common/roles/roles.common";
import { TokenService } from "src/token/token.service";
import { TUpdateAdmin } from "./types/TUpdateAdmin";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
        private readonly utils: UtilsService,
        private readonly rolesService: RolesService,
        private readonly tokenService: TokenService
    ){}

    async createAdmin(
        adminDetails: TCreateAdmin,
        req:any,
        res: Response
    ){
        try{
            const roleIndex = this.rolesService.getRoleIndex(adminDetails.role);
            if(!roleIndex) return res.status(HttpStatus.BAD_REQUEST).send("Keçərsiz rol");
            if(!req?.admin || !req.admin?.role || !this.rolesService.hasImpact(req.admin.role, roleIndex)){
                return res.status(HttpStatus.BAD_REQUEST).send("Sizin seçilmiş əməliyyatı hərəkətə keçirmək üçün icazəniz yoxdur.");
            }
            const adminID = this.utils.createNameBasedID(adminDetails.lastName, adminDetails.firstName);
            if(!adminID){
                return res.status(HttpStatus.BAD_REQUEST).send("Ad və ya soyad keçərli deyil");
            }
            const hashedPassword = await this.utils.hashPassword(adminDetails.password);
            if(!hashedPassword || adminDetails.password.length <= 5 || adminDetails.password === adminDetails.password.toLowerCase()){
                return res.status(HttpStatus.BAD_REQUEST).send("Şifrə keçərli deyil, biri böyük hərf olmaqla minimum 5 element olmalıdır.");
            }
            const adminObject = this.adminRepo.create({
                ...adminDetails,
                password:hashedPassword,
                role:roleIndex,
                createdAt:new Date(),
                adminID,
                accessToken:'',
                companyID:adminDetails?.companyID?.length > 5 ? adminDetails.companyID : '4IeUDopjde'
            });
            const adminData = await this.adminRepo.save(adminObject);
            if(!adminData){
                return res.status(HttpStatus.BAD_REQUEST).send("Admin yaradılması cəhdi uğursuzdur.");
            }
            return res.status(HttpStatus.CREATED).send("Admin yaradılması cəhdi uğurludur.");
        }catch(e){
            return res.status(HttpStatus.BAD_REQUEST).send(e);
        }
    }

    async checkAdminAuthority(req: any, res: Response){
        try{
            if(this.rolesService.getRoleIndex(req.admin.role) <= 2) return res.status(HttpStatus.OK).send();
            return res.status(HttpStatus.UNAUTHORIZED).send();
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
    }

    async getAdmin(
        adminID: string,
        req:any,
        res: Response
    ){
        try{
            if(!adminID){
                return res.status(HttpStatus.OK).json(this.restrictAdminData(req.admin));
            }
            const adminData = await this.adminRepo.findOne({
                where:{
                    adminID    
                }
            });
            if(!adminData) return res.status(HttpStatus.NOT_FOUND).send("Administrator tapılmadı");
            if(!this.rolesService.hasImpact(req.admin.role, this.rolesService.getRoleIndex(adminData.adminID)) && adminID !== req.admin.adminID) {
                return res.status(HttpStatus.BAD_REQUEST).send("Sizin seçilmiş əməliyyatı hərəkətə keçirmək üçün icazəniz yoxdur.");
            }
            return res.status(HttpStatus.OK).json(this.restrictAdminData(adminData));
        }catch(e){
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    private restrictAdminData(adminData:Admin){
        const {
            id,
            password,
            accessToken,
            ...returnData
        } = adminData;
        return {...returnData, role: this.rolesService.getRoleName(adminData.role)};
    }

    async adminLogin(payload:TAdminLogin, res: Response){
        const { admin, password } = payload;
        if(!admin || !password){
            return res.status(HttpStatus.BAD_REQUEST).send("Admin və ya şifrə daxil edin.")
        }
        const adminData = await this.adminRepo.findOne({
            where:{
                adminID: admin
            }
        });
        if(!adminData) return res.status(HttpStatus.NOT_FOUND).send("İstifadəçi adı və ya şifrə düzgün deyil.");
        const passwordMatches = await this.utils.comparePasswords(password, adminData.password);
        if(!passwordMatches) return res.status(HttpStatus.UNAUTHORIZED).send("İstifadəçi adı və ya şifrə düzgün deyil.");
        const accessToken = await this.tokenService.signAdminToken({
            id: adminData.id,
            adminID: adminData.adminID
        })
        if(!accessToken) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Sessiya yaradılmadı");
        const updateUserData = await this.updateAdminAsync(adminData, null, {
            accessToken: await this.utils.hashToken(accessToken)
        });
        if(!updateUserData){
            return res.status(HttpStatus.BAD_REQUEST).send("Giriş uğursuzdur.");
        }
        return res.status(HttpStatus.OK).json({
            accessToken
        });
    }

    private async updateAdminAsync(adminData: Admin | null, adminID:string | null, newData:Partial<Admin>){
        try{
            if(!adminData){
                adminData = await this.adminRepo.findOne({
                    where:{
                        adminID
                    }
                });
            }
            if(!adminData) return null;
            const newAdminData = {...adminData, ...newData};
            return await this.adminRepo.save(newAdminData);
        }catch(e){
            return null;
        }
    }  

    async updateAdmin(
        adminDetails: TUpdateAdmin,
        req:any,
        res: Response
    ){
        try{
            let newPartialData = adminDetails?.body;
            if(typeof(newPartialData.role) === 'string'){
                newPartialData.role = this.rolesService.getRoleIndex(newPartialData.role);
            }
            const adminData = await this.adminRepo.findOne({
                where:{
                    adminID: adminDetails.adminID
                }
            })
            if(!req?.admin || !req.admin?.role || !this.rolesService.hasImpact(req.admin.role, adminData.role) || 
                    newPartialData.accessToken || 
                    newPartialData.adminID || 
                    newPartialData.createdAt || 
                    newPartialData.firstName || 
                    newPartialData.lastName || 
                    newPartialData.fatherName || 
                    newPartialData.id ||
                    !this.rolesService.hasImpact(req.admin.role, newPartialData.role)
                ){
                return res.status(HttpStatus.BAD_REQUEST).send("Sizin seçilmiş əməliyyatı yerinə yetirmək üçün icazəniz yoxdur.");
            }
            newPartialData = {
                ...newPartialData,
                accessToken: newPartialData.accessToken, 
                adminID: newPartialData.adminID, 
                createdAt: newPartialData.createdAt, 
                firstName: newPartialData.firstName, 
                lastName: newPartialData.lastName, 
                fatherName: newPartialData.fatherName, 
                id: newPartialData.id
            }
            const updateData = await this.updateAdminAsync(adminData, null, newPartialData);
            if(!updateData) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Admin parametrlərinin dəyişilməsi cəhdi uğursuzdur.");
            return res.status(HttpStatus.CREATED).send("Admin parametrlərinin dəyişilməsi cəhdi uğurludur.");
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Admin parametrlərinin dəyişilməsi cəhdi uğursuzdur.");
        }
    }
    
    async getAdminAsync(adminID:string){
        try{
            if(!adminID){
                return null;
            }
            const adminData = await this.adminRepo.findOne({
                where:{
                    adminID
                }
            });
            if(!adminData) return null;
            return adminData;
        }catch(e){
            return null;
        }
    }  

}