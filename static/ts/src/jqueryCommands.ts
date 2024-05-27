import $ from "jquery";
import 'datatables.net';
export module jQueryAbstraction{
    export function dismiss(){
        $("#modal\\.flashes").empty()
        $("#modal").modal('hide')
        $("#resultsTable").dataTable().DataTable().clear().draw()
    }
    export function getExportButton(){
        return $("#exportButton").html();
    }
    export function setExportButton(content){
        $("#exportButton").html(content);
    }
}
