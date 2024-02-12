import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"parcel"})
export class Parcel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    parcelID: string;
    
    @Column({unique:false, nullable:false})
    pinoPointID: string;
    
    @Column({unique:false, nullable:false})
    pinoTrackingID: string;
    
    @Column({unique:false, nullable:false})
    articleID: string;

    @Column({unique:false, nullable:false})
    storeName: string;

    @Column({unique:false, nullable:false})
    storeAddress: string;

    @Column({unique:false, nullable:false})
    customerName: string;

    @Column({unique:false, nullable:false})
    customerPhone: string;
    
    @Column({unique:false, nullable:false})
    customerEmail: string;

    @Column({unique:false, nullable:false})
    weightKg: number;
    
    @Column({unique:false, nullable:false})
    date: Date;

    @BeforeInsert()
    @BeforeUpdate()
    replaceEmptyStringAsNull(){
        if (this.parcelID === '') this.parcelID = null;
        if (this.pinoPointID === '') this.pinoPointID = null;
        if (this.pinoTrackingID === '') this.pinoTrackingID = null;
        if (this.articleID === '') this.articleID = null;
        if (this.storeName === '') this.storeName = null;
        if (this.storeAddress === '') this.storeAddress = null;
        if (this.customerName === '') this.customerName = null;
        if (this.customerPhone === '') this.customerPhone = null;
        if (this.customerEmail === '') this.customerEmail = null;
    }
}