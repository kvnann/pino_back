import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"pino-point"})
export class PinoPoint{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    pinoPointID: string;

    @Column({unique:true, nullable:false})
    name:string;

    @Column({unique:false, nullable:false})
    location:string;

    @Column({unique:false, nullable:false})
    city:string;

    @Column({unique:false, nullable:false})
    district:string;

    @Column({unique:true, nullable:false})
    iban:string;

    @Column({unique:false, nullable:false})
    bankCode:string;

    @Column({unique:false, nullable:false})
    workingHours:string;
    
    @Column({unique:false, nullable:false})
    capacityNumber:number;

    @Column({unique:false, nullable:false})
    capacityKg:number;

    @Column({unique:false, nullable:false})
    responsibleName:string;

    @Column({unique:false, nullable:false})
    responsiblePhone:string;

    @Column({unique:false, nullable:false})
    type:string;

    @Column({unique:false, nullable:true})
    companyID:string;

    @Column({unique:false, default: ['']})
    photos:string[];

    @Column({unique:false, nullable:false})
    services:string[];

    @BeforeInsert()
    @BeforeUpdate()
    replaceEmptyStringAsNull() {
        if (this.pinoPointID === '') this.pinoPointID = null;
        if (this.name === '') this.name = null;
        if (this.location === '') this.location = null;
        if (this.city === '') this.city = null;
        if (this.district === '') this.district = null;
        if (this.iban === '') this.iban = null;
        if (this.bankCode === '') this.bankCode = null;
        if (this.companyID === '') this.companyID = null;
        if (this.workingHours === '') this.workingHours = null;
        if (this.responsibleName === '') this.responsibleName = null;
        if (this.responsiblePhone === '') this.responsiblePhone = null;
        if (this.type === '') this.type = null;
    }
}