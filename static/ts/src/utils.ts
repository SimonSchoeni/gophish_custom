import {Models} from "./models";
export module Utils{
    export function getEnumByValue(myEnum, enumValue){
        let keys = Object.keys(myEnum).filter(x => myEnum[x]==enumValue);
        return keys.length > 0? keys[0]:null;
    }
    export function getUniqueEventForUser(code:Models.Status_Codes, events: Models.Event[], email:string):number{
        var match = events.filter((value)=> value.email == email);
        return match.some(value => value.status == code) ? 1:0;
    }
    export function groupEventCountsPerPosition(code: Models.Status_Codes,camp:Models.Campaign): Models.PositionStatusCount[]{
        let results = [];
        camp.results.forEach((val)=> {
            let user = val.email;
            let counter = new Models.PositionStatusCount();
            counter.position = val.position;
            counter.count = this.getUniqueEventForUser(code, camp.events, user);
            counter.eventType = code;
            results.push(counter);
        });
        return results;
    }
}