import { RequestRepository } from "./requestRepository";
import { jQueryAbstraction } from "./jqueryCommands";
import { Models } from "./models";
import { Charting } from "./charting";

import Papa from "papaparse";
import { Utils } from "./utils";
//document.getElementById("testing").innerHTML = "BBB";
var campaign = new Models.Campaign();
export function exportAsCSV(scope:string){
    let exportButton = jQueryAbstraction.getExportButton();
    let filename = campaign.name + "-"+scope.toLocaleUpperCase+".csv";
    jQueryAbstraction.setExportButton("<i class=\"fa fa-spinner fa-spin\"></i>");
    let csv = scope == "results"? Papa.unparse(campaign.results,{"escapeFormulae":true}): Papa.unparse(campaign.events,{"escapeFormulae":true});
    let data = new Blob([csv],{"type":"text/csv;charset=utf-8"});
    if(navigator.msSaveBlob){
        navigator.msSaveBlob(data,filename);
    }
    else{
        let url = window.URL.createObjectURL(data);
        let dlLink = document.createElement('a');
        dlLink.href = url;
        dlLink.setAttribute('download',filename);
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    jQueryAbstraction.setExportButton(exportButton);
}

RequestRepository.getCampaignResult(133);

export async function refresh(){
    jQueryAbstraction.hideRefreshButton();
    jQueryAbstraction.showRefreshMessage();
    campaign = await RequestRepository.getCampaignResult(campaign.id);
    //Define the values we want to track in the way Status : Count
    jQueryAbstraction.updateTimeline(campaign);
    var email_series_data : EnumDictionary<Models.Status_Codes, number>= {
        [Models.Status_Codes.Sent]: 0,
        [Models.Status_Codes.Opened]: 0,
        [Models.Status_Codes.Clicked]: 0,
        [Models.Status_Codes.Submitted]: 0,
        [Models.Status_Codes.Downloaded]: 0,
        };
    //Check if any user out of the result actually had this event occur
    for(let key in email_series_data){
        for(let result of campaign.results){
            email_series_data[key] += Utils.getUniqueEventForUser(Utils.getEnumByValue(Models.Status_Codes, key) as Models.Status_Codes,campaign.events,result.email);
        }
    }
    //Prepare for chart updating
    for(let key in email_series_data){
        let email_data = [];
        let count = email_series_data[key];
        //The actual percentage value out of all possible results
        email_data.push({
            name:key,
            y:Math.floor((count/campaign.results.length)*100),
            count: count
        })
        //The difference filler
        email_data.push({
            name : '',
            y: 100-Math.floor((count / campaign.results.length) * 100)
        });
        jQueryAbstraction.updatePieChart(Utils.getEnumByValue(Models.Status_Codes,key) as Models.Status_Codes,email_data);
    }
    jQueryAbstraction.buildResultsTable(campaign);
    jQueryAbstraction.tooltip();
    jQueryAbstraction.showRefreshButton();
    jQueryAbstraction.hideRefreshMessage();
}