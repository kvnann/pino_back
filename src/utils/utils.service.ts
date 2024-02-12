import { Injectable } from "@nestjs/common";
import * as argon from "argon2"

@Injectable()
export class UtilsService{
    createRandomString(length:number):string{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLength = characters.length;
        let customString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charLength);
          customString += characters.charAt(randomIndex);
        }
      
        return customString;
    }
    restrictString(text:string, visible?:number, reversed?:boolean){
      if(!text){
        return null;
      }
      return reversed ? `*****${text.slice(text.length-(visible??3),text.length)}` : `${text.slice(0,visible??3)}*****`;
    }
    createNameBasedID(first:string, second:string):string{
      try{
        return `${first.slice(0,2)}${second.slice(0,1)}${Math.floor(Math.random()*10000000 + 1000000)}`.toLowerCase() ?? null
      }catch(e){
        return null;
      }
    }
    async hashPassword(password: string): Promise<string> {
      try {
        const hashedPassword = await argon.hash(password);
        return hashedPassword;
      } catch (error) {
        return null;
      }
    }
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
      try {
        const passwordMatches = await argon.verify(hashedPassword, plainPassword);
        return passwordMatches;
      } catch (error) {
        return null;
      }
    }
    async hashToken(input: string): Promise<string> {
      const hashString = await argon.hash(input, {salt: Buffer.from(process.env.JWT_HASHING_SECRET)})
      return hashString;
    }
}