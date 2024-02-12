import { HttpStatus, Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { Admin } from "src/typeorm/entities/AdminEntity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService{
    constructor(
        
    ){}

}