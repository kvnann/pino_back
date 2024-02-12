import { Body, Controller, Delete, Get, Headers, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { RequestService } from "./request.service";
import { CreateRequestDto } from "./dto/CreateRequestDto";

@Controller('request')
export class RequestController{
    constructor(
        private readonly requestRervice: RequestService
    ){}

    @Get('')
    getRequest(
        @Res() res:Response,
        @Headers('anonymID') anonymID: string,
    ){
        let fullAccess = false;
        return this.requestRervice.getRequest(anonymID, fullAccess, res);
    }

    @Get('/all')
    getAll(
        @Res() res:Response,
        @Query('archived') archivedNumber: number
    ){
        const archivedBoolean = archivedNumber != 0;
        return this.requestRervice.getAllRequests(archivedBoolean,res);
    }

    @Delete('')
    archiveRequest(
        @Res() res:Response,
        @Query('id') id: number
    ){
        return this.requestRervice.archiveRequest(id, res);
    }

    @Post('')
    createRequest(
        @Body() payload: CreateRequestDto,
        @Res() res:Response,
        @Headers('anonymID') anonymID: string,
    ){  
        return this.requestRervice.createRequest({...payload, anonymID}, res);
    }
}