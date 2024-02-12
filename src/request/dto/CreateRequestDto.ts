export type CreateRequestDto = {
    anonymID?: string;
    deliveryType: 'pino' | 'delivery';
    tel:string;
    voen:string;
    email:string;
    address:string;
    companyName:string;
    country:string;
    city:string;
    district:string;
    termsAccepted:boolean;
}