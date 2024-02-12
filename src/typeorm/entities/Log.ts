import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"log"})
export class Log{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:''})
    method: string;

    @Column({default:''})
    url: string;

    @Column({default:''})
    userID: string;

    @Column({default:''})
    username: string;

    @Column({default:''})
    token: string;

    @Column({default:''})
    bodyString: string;

    @Column({default:''})
    queryString: string;

    @Column()
    time: Date;

    @Column({default:''})
    text: string;
}