import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"admins"})
export class Admin{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number;

    @Column({unique:true, nullable:false})
    adminID: string;

    @Column({unique:false, nullable:false})
    firstName: string;

    @Column({unique:false, nullable:false})
    password: string;

    @Column({unique:false, nullable:true})
    fatherName: string;

    @Column({unique:false, nullable:false})
    lastName: string;

    @Column({unique:true, nullable:true, default: ''})
    accessToken: string;

    @Column({unique:true, nullable: true})
    tel:string;

    @Column({unique:true, nullable: true})
    email:string;

    @Column({nullable: false, unique: false})
    companyID:string;

    @Column({nullable: true})
    country:string;

    @Column({nullable: true})
    city:string;

    @Column({nullable: true})
    district:string;

    @Column({nullable: false})
    role:number;

    @Column({nullable: false})
    createdAt:Date;
    
    @BeforeInsert()
    @BeforeUpdate()
    replaceEmptyStringAsNull() {
        if (this.adminID === '') this.adminID = null;
        if (this.tel === '') this.tel = null;
        if (this.email === '') this.email = null;
        if (this.country === '') this.country = null;
        if (this.city === '') this.city = null;
        if (this.district === '') this.district = null;
        if (this.companyID === '') this.companyID = null;
        if (this.firstName === '') this.firstName = null;
        if (this.lastName === '') this.lastName = null;
        if (this.fatherName === '') this.fatherName = null;
    }
}