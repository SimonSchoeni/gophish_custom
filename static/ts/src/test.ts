import { test } from "./test2";
import { RequestRepository } from "./requestRepository";
import { jQueryAbstraction } from "./jqueryCommands";
import { Models } from "./models";
import Papa from "papaparse";
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
let cc = new test.exportedFile();
console.log(cc.sayHello());