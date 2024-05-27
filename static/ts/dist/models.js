import { Utils } from "./utils.js";
export var Models;
(function (Models) {
    let Status_Codes;
    (function (Status_Codes) {
        Status_Codes["Sent"] = "Email Sent";
        Status_Codes["Opened"] = "Email Openend";
        Status_Codes["Clicked"] = "Clicked Link";
        Status_Codes["Submitted"] = "Submitted Data";
        Status_Codes["Downloaded"] = "Downloaded File";
        Status_Codes["Created"] = "Campaign Created";
        Status_Codes["None"] = "None";
    })(Status_Codes = Models.Status_Codes || (Models.Status_Codes = {}));
    let Campaign_Status_Codes;
    (function (Campaign_Status_Codes) {
        Campaign_Status_Codes["InProgress"] = "In progress";
        Campaign_Status_Codes["Queued"] = "Queued";
        Campaign_Status_Codes["Created"] = "Created";
        Campaign_Status_Codes["MailSent"] = "Emails Sent";
        Campaign_Status_Codes["Complete"] = "Completed";
        Campaign_Status_Codes["Scheduled"] = "Scheduled";
        Campaign_Status_Codes["Retry"] = "Retrying";
        Campaign_Status_Codes["None"] = "None";
    })(Campaign_Status_Codes = Models.Campaign_Status_Codes || (Models.Campaign_Status_Codes = {}));
    class Event {
        constructor() {
            this.campaign_id = 0;
            this.email = "";
            this.time = new Date();
            this.status = Status_Codes.None;
            this.details = "";
        }
    }
    Models.Event = Event;
    class Result {
        constructor() {
            this.rid = "";
            this.status = Status_Codes.None;
            this.ip = "";
            this.latitude = 0;
            this.longitude = 0;
            this.sent_date = new Date();
            this.reported = false;
            this.modified_date = new Date();
            this.email = "";
            this.first_name = "";
            this.last_name = "";
            this.position = "";
        }
    }
    Models.Result = Result;
    class Campaign {
        constructor() {
            this.id = 0;
            this.name = "";
            this.results = [];
            this.events = [];
            this.status = Campaign_Status_Codes.None;
        }
        fromResponse(responseJson) {
            var _a;
            this.id = responseJson.id;
            this.name = responseJson.name;
            this.status = (_a = Utils.getEnumByValue(Campaign_Status_Codes, responseJson.status)) !== null && _a !== void 0 ? _a : Campaign_Status_Codes.None;
            responseJson.timeline.forEach(element => {
                var _a;
                let event = new Event();
                event.campaign_id = responseJson.id;
                event.details = element.details;
                event.email = element.email;
                event.time = element.time;
                let statusValue = (_a = Utils.getEnumByValue(Status_Codes, element.message)) !== null && _a !== void 0 ? _a : Status_Codes.None;
                event.status = statusValue;
                this.events.push(event);
            });
            responseJson.results.forEach(element => {
                var _a;
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
                result.status = (_a = Utils.getEnumByValue(Status_Codes, element.status)) !== null && _a !== void 0 ? _a : Status_Codes.None;
                this.results.push(result);
            });
            return this;
        }
    }
    Models.Campaign = Campaign;
})(Models || (Models = {}));
