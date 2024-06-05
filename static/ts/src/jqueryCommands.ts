import $, { event } from "jquery";
import 'datatables.net';
import UAParser from "ua-parser-js";
import escapeHTML from "escape-html";
import { Models } from "./models";
const moment = require('moment');
const preDefinitions = new Models.DefaultDisplayDefinitions();

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

    //This is still unrefactored from gophish
    function renderDevice(details:any): string{
        let ua = UAParser(details.browser['user-agent']);
        var detailsString = '<div class="timeline-device-details">'
        var deviceIcon = 'laptop'
        if (ua.device.type) {
            if (ua.device.type == 'tablet' || ua.device.type == 'mobile') {
                deviceIcon = ua.device.type
            }
        }
        var deviceVendor = ''
        if (ua.device.vendor) {
            deviceVendor = ua.device.vendor.toLowerCase()
            if (deviceVendor == 'microsoft') deviceVendor = 'windows'
        }
        var deviceName = 'Unknown'
        if (ua.os.name) {
            deviceName = ua.os.name
            if (deviceName == "Mac OS") {
                deviceVendor = 'apple'
            } else if (deviceName == "Windows") {
                deviceVendor = 'windows'
            }
            if (ua.device.vendor && ua.device.model) {
                deviceName = ua.device.vendor + ' ' + ua.device.model
            }
        }
    
        if (ua.os.version) {
            deviceName = deviceName + ' (OS Version: ' + ua.os.version + ')'
        }

        let deviceString = '<div class="timeline-device-os"><span class="fa fa-stack">' +
            '<i class="fa fa-' + escapeHTML(deviceIcon) + ' fa-stack-2x"></i>' +
            '<i class="fa fa-vendor-icon fa-' + escapeHTML(deviceVendor) + ' fa-stack-1x"></i>' +
            '</span> ' + escapeHTML(deviceName) + '</div>'
    
        detailsString += deviceString
        var deviceBrowser = 'Unknown'
        var browserIcon = 'info-circle'
        var browserVersion = ''
    
        if (ua.browser && ua.browser.name) {
            deviceBrowser = ua.browser.name
            // Handle the "mobile safari" case
            deviceBrowser = deviceBrowser.replace('Mobile ', '')
            if (deviceBrowser) {
                browserIcon = deviceBrowser.toLowerCase()
                if (browserIcon == 'ie') browserIcon = 'internet-explorer'
            }
            browserVersion = '(Version: ' + ua.browser.version + ')'
        }
    
        var browserString = '<div class="timeline-device-browser"><span class="fa fa-stack">' +
            '<i class="fa fa-' + escapeHTML(browserIcon) + ' fa-stack-1x"></i></span> ' +
            deviceBrowser + ' ' + browserVersion + '</div>'
    
        detailsString += browserString
        detailsString += '</div>'
        return detailsString
    }

    function renderTimeline(camp: Models.Campaign, record: Models.Result):string{
        let codesForDeviceRendering = [Models.Status_Codes.Clicked, Models.Status_Codes.Submitted, Models.Status_Codes.Downloaded];
        let results = '<div class="timeline col-sm-12 well well-lg">' +
        '<h6>Timeline for ' + escapeHTML(record.first_name) + ' ' + escapeHTML(record.last_name) +
        '</h6><span class="subtitle">Email: ' + escapeHTML(record.email) +
        '<br>Result ID: ' + escapeHTML(record.rid) + '</span>' +
        '<div class="timeline-graph col-sm-6">';
        camp.events.forEach((event) => {
            if(!event.email || event.email == record.email){
                results += '<div class="timeline-entry">' +
                    '    <div class="timeline-bar"></div>';
                results +=
                    '    <div class="timeline-icon ' + preDefinitions.getByStatus(event.status).label + '">' +
                    '    <i class="fa ' + preDefinitions.getByStatus(event.status).icon + '"></i></div>' +
                    '    <div class="timeline-message">' + escapeHTML(event.status) +
                    '    <span class="timeline-date">' + moment.utc(event.time).local().format('MMMM Do YYYY h:mm:ss a') + '</span>';
                    if (event.details) {
                        let details = JSON.parse(event.details)
                        if (codesForDeviceRendering.some(rend => rend == event.status)) {
                            let deviceView = renderDevice(details)
                            if (deviceView) {
                                results += deviceView;
                            }
                        }
                        if (event.status == Models.Status_Codes.Submitted) {
                            results += '<div class="timeline-event-details"><i class="fa fa-caret-right"></i> View Details</div>';
                        }
                        if (details.payload) {
                            results += '<div class="timeline-event-results">';
                            results += '    <table class="table table-condensed table-bordered table-striped">';
                            results += '        <thead><tr><th>Parameter</th><th>Value(s)</tr></thead><tbody>';
                            $.each(Object.keys(details.payload), function (i, param) {
                                if (param == "rid") {
                                    return true;
                                }
                                results += '    <tr>';
                                results += '        <td>' + escapeHTML(param) + '</td>';
                                results += '        <td>' + escapeHTML(details.payload[param]) + '</td>';
                                results += '    </tr>';
                            })
                            results += '       </tbody></table>';
                            results += '</div>';
                        }
                        if (details.error) {
                            results += '<div class="timeline-event-details"><i class="fa fa-caret-right"></i> View Details</div>';
                            results += '<div class="timeline-event-results">';
                            results += '<span class="label label-default">Error</span> ' + details.error;
                            results += '</div>';
                        }
                    }
                results += '</div></div>';
            }
        });
        if (record.status == Models.Status_Codes.Scheduled || record.status == Models.Status_Codes.Retry) {
            results += '<div class="timeline-entry">' +
                '    <div class="timeline-bar"></div>'
            results +=
                '    <div class="timeline-icon ' + preDefinitions.getByStatus(record.status).label + '">' +
                '    <i class="fa ' + preDefinitions.getByStatus(record.status).icon + '"></i></div>' +
                '    <div class="timeline-message">' + "Scheduled to send at " + record.sent_date + '</span>'
        }
        results += '</div></div>'
        return results
    }

    export function createStatusLabel(status: Models.Status_Codes, send_date: string):string {
        var label = preDefinitions.getByStatus(status).label || "label-default";
        var statusColumn = "<span class=\"label " + label + "\">" + status + "</span>"
        // Add the tooltip if the email is scheduled to be sent
        if (status == "Scheduled" || status == "Retrying") {
            var sendDateMessage = "Scheduled to send at " + moment.utc(send_date).local().format('MMMM Do YYYY h:mm:ss a')
            statusColumn = "<span class=\"label " + label + "\" data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\" title=\"" + sendDateMessage + "\">" + status + "</span>"
        }
        return statusColumn;
    }

    export function buildResultsTable(campaign: Models.Campaign){
        let resultsTable = $("#resultsTable").DataTable()
            resultsTable.rows().every(function (i, tableLoop, rowLoop) {
                var row = this.row(i)
                var rowData = row.data()
                var rid = rowData[0]
                $.each(campaign.results, function (j, result) {
                    if (result.rid == rid) {
                        rowData[8] = moment(result.sent_date).format('MMMM Do YYYY, h:mm:ss a')
                        rowData[7] = result.reported
                        rowData[6] = result.status
                        resultsTable.row(i).data(rowData)
                        if (row.child.isShown()) {
                            $(row.node()).find("#caret").removeClass("fa-caret-right")
                            $(row.node()).find("#caret").addClass("fa-caret-down")
                            row.child(renderTimeline(campaign,row.data()))
                        }
                        return false
                    }
                })
            })
            resultsTable.draw(false)
    }

    export function updateTimeline(campaign: Models.Campaign){
        var timeline_series_data = []
            $.each(campaign.events, function (i, event) {
                var event_date = moment.utc(event.time).local()
                timeline_series_data.push({
                    email: event.email,
                    message: event.status,
                    x: event_date.valueOf(),
                    y: 1,
                    marker: {
                        fillColor:preDefinitions.getByStatus(event.status).color
                    }
                })
            })
            var timeline_chart = $("#timeline_chart").highcharts()
            timeline_chart.series[0].update({
                data: timeline_series_data
            })
    }

    export function updatePieChart(status: Models.Status_Codes,data:any ){
        var chart = $("#" + status + "_chart").highcharts()
                chart.series[0].update({
                    data: data
            });
    }

    export function tooltip(){
        $('[data-toggle="tooltip"]').tooltip();
    }
    export function hideRefreshMessage(){
        $("#refresh_message").hide();
    }
    export function showRefreshMessage(){
        $("#refresh_message").show()
    }
    export function showRefreshButton(){
        $("#refresh_btn").show();
    }
    export function hideRefreshButton(){
        $("#refresh_btn").hide();
    }
}
