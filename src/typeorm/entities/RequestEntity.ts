import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"requests"})
export class RequestEntity{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number;

    @Column({unique:true})
    anonymID: string;

    @Column({nullable:true, default: ''})
    anonymHistory: string;

    @Column({unique:true, nullable: false})
    tel:string;

    @Column({ default: '' })
    email:string;

    @Column({ unique: true, nullable: false })
    voen:string;

    @Column({nullable: false})
    address:string;

    @Column({default: false})
    archived:boolean;

    @Column({nullable: true})
    companyName:string;

    @Column({nullable: false})
    country:string;

    @Column({nullable: false})
    city:string;

    @Column({nullable: false})
    district:string;

    @Column()
    termsAccepted:boolean;
    
    @BeforeInsert()
    @BeforeUpdate()
    replaceEmptyStringAsNull() {
        if (this.address === '') this.address = null;
        if (this.anonymID === '') this.anonymID = null;
        if (this.tel === '') this.tel = null;
        if (this.voen === '') this.voen = null;
        if (this.companyName === '') this.companyName = null;
        if (this.country === '') this.country = null;
        if (this.city === '') this.city = null;
        if (this.district === '') this.district = null;
    }
}