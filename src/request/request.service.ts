import { HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";
import { CreateRequestDto } from "./dto/CreateRequestDto";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestEntity } from "src/typeorm/entities/RequestEntity";
import { Repository } from "typeorm";
import { UtilsService } from "src/utils/utils.service";

@Injectable()
export class RequestService{
    constructor(
        @InjectRepository(RequestEntity) private requestRepo: Repository<RequestEntity>,
        private readonly utils: UtilsService
    ){}

    getHello(res:Response){
        return res.status(HttpStatus.OK).send("Hello World!");
    }
    
    async getRequest(
        anonymID: string,
        fullAccess: boolean,
        res:Response
    ):Promise<Response>{
        if(!anonymID) return res.status(HttpStatus.BAD_REQUEST).send("No Anonym ID provided");
        try{
            const requestData = await this.requestRepo.findOne({
                where: {
                    anonymID 
                }
            });
            if(!requestData) return res.status(200).json({});
            const responseData: Partial<RequestEntity> = fullAccess ? requestData : {
                tel: this.utils.restrictString(requestData.tel, 3, true),
                email: this.utils.restrictString(requestData.email, 3) ?? '-',
                companyName: this.utils.restrictString(requestData.companyName, 3) ?? '-',
            }
            return res.status(HttpStatus.ACCEPTED).json(responseData);
        }catch(e){
            return res.status(HttpStatus.BAD_REQUEST).send("Bad Request");
        }
    }

    async getAllRequests(
        archived:boolean,
        res:Response
    ):Promise<Response>{
        try{
            const allRequestsData = await this.requestRepo.find({
                where:{
                    archived
                }
            });
            if(!allRequestsData || allRequestsData.length < 1) return res.status(200).json([]);
            return res.status(HttpStatus.ACCEPTED).json(allRequestsData);
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Interval Server Error");
        }
    }

    async createRequest(
        payload: CreateRequestDto,
        res:Response
    ):Promise<Response>{
        if(!payload.anonymID) return res.status(HttpStatus.BAD_REQUEST).send("Xəta baş verdi. Digər brauzer/cihazdan cəhd edin.");
        const duplicateEmail = await this.requestRepo.findOne({
            where: {email: payload.email}
            
        });
        const duplicateVoen = await this.requestRepo.findOne({
            where: {voen: payload.voen}
            
        });
        const duplicateTel = await this.requestRepo.findOne({
            where: {tel: payload.tel}
            
        });
        if(duplicateTel){
            return res.status(HttpStatus.CONFLICT).send("Bu telefon nömrəsi ilə artıq qeydiyyat olunub. Ləğv etmək üçün müştəri dəstəyinə müraciət edin.")
        }
        if(duplicateEmail){
            return res.status(HttpStatus.CONFLICT).send("Bu e-poçt ilə artıq qeydiyyat olunub. Ləğv etmək üçün müştəri dəstəyinə müraciət edin.")
        }
        if(duplicateVoen){
            return res.status(HttpStatus.CONFLICT).send("Bu VÖEN-lə artıq qeydiyyat olunub. Ləğv etmək üçün müştəri dəstəyinə müraciət edin.")
        }
        try{
            const createdRequest = this.requestRepo.create(payload);
            await this.requestRepo.save(createdRequest);
        }catch(e){
            console.log(e)
            return res.status(HttpStatus.BAD_REQUEST).send("Müraciət qeydə alınmadı.");
        }
        return res.status(HttpStatus.ACCEPTED).send("Müraciət qeydə alındı!");
    }

    async archiveRequest(
        id: number,
        res:Response,
    ):Promise<Response>{
        try{
            const updateData = await this.requestRepo.update({id}, {archived:true});
            if(!updateData) return res.status(404).send("Müraciət Tapılmadı");
            return res.status(HttpStatus.ACCEPTED).send("Müraciət uğurla arxivləndi");
        }catch(e){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Interval Server Error");
        }
    }
}