import { Injectable } from "@nestjs/common";

@Injectable()
export class RolesService{

    private accessList = {
        "admin POST":[1, 2, 3],
        "admin GET":[1, 2, 3],
        "admin PUT":[1, 2, 3],
        "request POST":[1, 2, 3],
        "request/all GET":[1, 2, 3],
        "request UPDATE":[1, 2, 3],
        "request DELETE":[1, 2, 3],
        "admin/check-authority GET":[1, 2]
    }

    private roles = [
        {name:"Baş Administrator", roleIndex:1},
        {name:"Administrator",roleIndex:2},
        {name:"Şirkət Administrator",roleIndex:3},
        {name:"Filial Administrator",roleIndex:4},
    ]

    hasAccess(route:string, method:string, role:number):boolean{
        try{
            if(route.indexOf("?")){
                route = route.split('?')[0];
            }
            if(route.startsWith('/')){    
                route = route.slice(1,route.length)
            };
            if(route.endsWith('/')) {
                route = route.slice(0,route.length-1)
            };
            return this.accessList[`${route.toLowerCase()} ${method.toUpperCase()}`].indexOf(role) > -1;
        }catch(e){
            return false;
        }
    }

    hasImpact(role:number, target:number):boolean{
        return role < target;
    }

    getRoleIndex(roleName:string):number|null{
        try{
            return this.roles.find(r=>r.name === roleName).roleIndex ?? null
        }catch(e){
            return null;
        }
    }
    
    getRoleName(roleIndex:number):string|null{
        try{
            return this.roles.find(r=>r.roleIndex === roleIndex).name ?? null
        }catch(e){
            return null;
        }
    }

}