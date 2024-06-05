import { Utils } from "./utils";

export module Models{

    export enum Status_Codes{
        Sent = "Email Sent",
        MailSent= "Emails Sent",
        InProgress = "In progress",
        Queued = "Queued",
        Completed = "Completed",
        Opened = "Email Openend",
        Clicked = "Clicked Link",
        Downloaded = "Downloaded File",
        Success = "Success",
        Reported = "Email Reported",
        Error = "Error",
        ErrorSendingMail = "Error Sending Email",
        Submitted = "Submitted Data",
        Unknown = "Unknown",
        Sending = "Sending",
        Retry = "Retrying",
        Created = "Campaign Created",
        Scheduled = "Scheduled",
        None = "None"
    }


    export class DefaultDisplayDefinitions{
        private definitions: DisplayDefinition[];
        constructor(){
            this.definitions = [
                new DisplayDefinition(Status_Codes.Sent,"#1abc9c","fa-envelope","label-success","ct-point-sent"),
                new DisplayDefinition(Status_Codes.MailSent,"#1abc9c","fa-envelope","label-success","ct-point-sent"),
                new DisplayDefinition(Status_Codes.InProgress,"","","label-primary",""),
                new DisplayDefinition(Status_Codes.Queued,"","","label-info",""),
                new DisplayDefinition(Status_Codes.Completed,"","","label-success",""),
                new DisplayDefinition(Status_Codes.Opened,"#f9bf3b","fa-envelope-open","label-warning","ct-point-opened"),
                new DisplayDefinition(Status_Codes.Clicked,"#F39C12","fa-mouse-pointer","label-clicked","ct-point-clicked"),
                new DisplayDefinition(Status_Codes.Downloaded,"#9511e2","fa-solid fa-download","label-downloaded","ct-point-downloaded"),
                new DisplayDefinition(Status_Codes.Success,"#f05b4f","fa-exclamation","label-danger","ct-point-clicked"),
                new DisplayDefinition(Status_Codes.Reported,"#45d6ef","fa-bullhorn","label-info","ct-point-reported"),
                new DisplayDefinition(Status_Codes.Error,"#6c7a89","fa-times","label-default","ct-point-error"),
                new DisplayDefinition(Status_Codes.ErrorSendingMail,"#6c7a89","fa-times","label-default","ct-point-error"),
                new DisplayDefinition(Status_Codes.Submitted,"#f05b4f","fa-exclamation","label-danger","ct-point-clicked"),
                new DisplayDefinition(Status_Codes.Unknown,"#6c7a89","fa-question","label-default","ct-point-error"),
                new DisplayDefinition(Status_Codes.Sending,"#428bca","fa-spinner","label-primary","ct-point-sending"),
                new DisplayDefinition(Status_Codes.Retry,"#6c7a89","fa-clock-o","label-default","ct-point-sending"),
                new DisplayDefinition(Status_Codes.Scheduled,"#428bca","fa-clock-o","label-primary","ct-point-sending"),
                new DisplayDefinition(Status_Codes.Created,"","fa-rocket","label-success","")
            ];
        }
        getByStatus(code: Status_Codes):DisplayDefinition{
            this.definitions.forEach(def => {
                if(def.statusCode == code){
                    return def;
                }
            });
            return new DisplayDefinition(Status_Codes.None,"","","","");
        }
    }
    export class PositionStatusCount{
        eventType: Status_Codes = Status_Codes.None;
        position: String = "";
        count: number = 0;
    }

    
    export class DisplayDefinition{
        color: string = "";
        icon: string = "";
        label: string = "";
        point: string = "";
        statusCode: Status_Codes = Status_Codes.None;
        constructor(code: Status_Codes, color: string, icon:string, label:string,point:string){
            this.statusCode = code;
            this.color = color;
            this.icon= icon;
            this.label = label;
            this.point = point;
        }
    }


    export class Event{
        campaign_id:number = 0;
        email: string = "";
        time: Date = new Date();
        status: Status_Codes = Status_Codes.None;
        details: string = "";
    }
    export class Result{
        rid: string = "";
        status: Status_Codes= Status_Codes.None;
        ip: string = "";
        latitude: number = 0;
        longitude: number = 0;
        sent_date: Date = new Date();
        reported: boolean = false;
        modified_date: Date = new Date();
        email: string = "";
        first_name: string = "";
        last_name: string = "";
        position: string = "";
        constructor(){

        }
    }
    export class Campaign
    {
        id:number = 0;
        name: string = "";
        results: Result[] = [];
        events: Event[] = [];
        status: Status_Codes = Status_Codes.None;
        constructor(){

        }
        fromResponse(responseJson):Campaign{
            this.id = responseJson.id;
            this.name = responseJson.name;
            this.status = Utils.getEnumByValue(Status_Codes, responseJson.status) as Status_Codes?? Status_Codes.None;
            responseJson.timeline.forEach(element => {
                let event = new Event();
                event.campaign_id = responseJson.id;
                event.details = element.details;
                event.email = element.email;
                event.time = element.time;
                let statusValue = Utils.getEnumByValue(Status_Codes, element.message) as Status_Codes ?? Status_Codes.None;
                event.status = statusValue;
                this.events.push(event);
            });
            responseJson.results.forEach(element => {
                let result = new Result();
                result.email = element.email;
                result.first_name = element.first_name;
                result.rid = element.id;
                result.last_name = element.last_name;
                result.latitude = element.latitude;
                result.ip = element.ip;
                result.longitude = element.longitude;
                result.modified_date = element.modified_date;
                result.position = element.position;
                result.reported = element.reported;
                result.sent_date = element.send_date;
                result.status = Utils.getEnumByValue(Status_Codes, element.status) as Status_Codes ?? Status_Codes.None;
                this.results.push(result);
            });
        
            return this;
        }
    }
    
}