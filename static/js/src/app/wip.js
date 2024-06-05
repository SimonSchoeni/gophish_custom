var doPoll = true;
function groupEventsByEmail(timeline) {
    return timeline.reduce((acc, event) => {
        const email = event.email || 'No Email';
        if (!acc[email]) {
            acc[email] = [];
        }
        acc[email].push(event);
        return acc;
    }, {});
}

function hasPropertyValue(arr, property, value) {
    return arr.some(item => item[property] === value);
}



// Deletes a campaign after prompting the user
function deleteCampaign() {
    Swal.fire({
        title: "Are you sure?",
        text: "This will delete the campaign. This can't be undone!",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Delete Campaign",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                delete campaign;
            })
        }
    }).then(function (result) {
        if(result.value){
            Swal.fire(
                'Campaign Deleted!',
                'This campaign has been deleted!',
                'success'
            );
        }
        $('button:contains("OK")').on('click', function () {
            location.href = '/campaigns'
        })
    })
}

// Completes a campaign after prompting the user
function completeCampaign() {
    Swal.fire({
        title: "Are you sure?",
        text: "Gophish will stop processing events for this campaign",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Complete Campaign",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                complete campaign campaign;
            })
        }
    }).then(function (result) {
        if (result.value){
            Swal.fire(
                'Campaign Completed!',
                'This campaign has been completed!',
                'success'
            );
            $('#complete_button')[0].disabled = true;
            $('#complete_button').text('Completed!')
            doPoll = false;
        }
    })
}

// Exports campaign results as a CSV file
//I dont want the replay functionality 

/**
 * Returns an HTML string that displays the OS and browser that clicked the link
 * or submitted credentials.
 * 
 * @param {object} event_details - The "details" parameter for a campaign
 *  timeline event
 * 
 */


var renderTimelineChart = function (chartopts) {
   
}

/* Renders a pie chart using the provided chartops */
var renderPieChart = function (chartopts) {
   
}


var renderSpecificPercentage = function (chartopts) {
    
}



/**
 * Creates a status label for use in the results datatable
 * @param {string} status 
 * @param {moment(datetime)} send_date 
 */
function createStatusLabel(status, send_date) {
    
}

/* poll - Queries the API and updates the UI with the results
 *
 * Updates:
 * * Timeline Chart
 * * Email (Donut) Chart
 * * Map Bubbles
 * * Datatables
 */

function poll() {
    api.campaignId.results(campaign.id)
        .success(function (c) {
            
        })
}

function load() {
    campaign.id = window.location.pathname.split('/').slice(-1)[0]
    api.campaignId.results(campaign.id)
        .success(function (c) {
            campaign = c
            if (campaign) {
                $("title").text(c.name + " - Gophish")
                $("#loading").hide()
                $("#campaignResults").show()
                // Set the title
                $("#page-title").text("Results for " + c.name)
                if (c.status == "Completed") {
                    $('#complete_button')[0].disabled = true;
                    $('#complete_button').text('Completed!');
                    doPoll = false;
                }
                // Setup viewing the details of a result
                $("#resultsTable").on("click", ".timeline-event-details", function () {
                    // Show the parameters
                    payloadResults = $(this).parent().find(".timeline-event-results")
                    if (payloadResults.is(":visible")) {
                        $(this).find("i").removeClass("fa-caret-down")
                        $(this).find("i").addClass("fa-caret-right")
                        payloadResults.hide()
                    } else {
                        $(this).find("i").removeClass("fa-caret-right")
                        $(this).find("i").addClass("fa-caret-down")
                        payloadResults.show()
                    }
                })
                // Setup the results table
                resultsTable = $("#resultsTable").DataTable({
                    destroy: true,
                    "order": [
                        [2, "asc"]
                    ],
                    columnDefs: [{
                            orderable: false,
                            targets: "no-sort"
                        }, {
                            className: "details-control",
                            "targets": [1]
                        }, {
                            "visible": false,
                            "targets": [0, 8]
                        },
                        {
                            "render": function (data, type, row) {
                                return createStatusLabel(data, row[8])
                            },
                            "targets": [6]
                        },
                        {
                            className: "text-center",
                            "render": function (reported, type, row) {
                                if (type == "display") {
                                    if (reported) {
                                        return "<i class='fa fa-check-circle text-center text-success'></i>"
                                    }
                                    return "<i role='button' class='fa fa-times-circle text-center text-muted' onclick='report_mail(\"" + row[0] + "\", \"" + campaign.id + "\");'></i>"
                                }
                                return reported
                            },
                            "targets": [7]
                        }
                    ]
                });
                resultsTable.clear();
                var email_series_data = {}
                var timeline_series_data = []
                Object.keys(statusMapping).forEach(function (k) {
                    email_series_data[k] = 0
                });
                //This is some fucked up stuff in order to get the events per E-Mail. If a user with a certain E-Mail downloaded it twice, it will only show up as one.
                var grouping = groupEventsByEmail(campaign.timeline);
                $.each(grouping, function(i,g){
                    if(hasPropertyValue(g,'message','Downloaded File')){
                        email_series_data["Downloaded File"]++
                    }
                });
                $.each(campaign.results, function (i, result) {
                    resultsTable.row.add([
                        result.id,
                        "<i id=\"caret\" class=\"fa fa-caret-right\"></i>",
                        escapeHtml(result.first_name) || "",
                        escapeHtml(result.last_name) || "",
                        escapeHtml(result.email) || "",
                        escapeHtml(result.position) || "",
                        result.status,
                        result.reported,
                        moment(result.send_date).format('MMMM Do YYYY, h:mm:ss a')
                    ])
                    email_series_data[result.status]++;
                    if (result.reported) {
                        email_series_data['Email Reported']++
                    }
                    // Backfill status values
                    //This complete structure is not very nice.
                    var step = progressListing.indexOf(result.status)
                    for (var i = 0; i < step; i++) {
                        email_series_data[progressListing[i]]++
                    }
                })
                resultsTable.draw();
                // Setup tooltips
                $('[data-toggle="tooltip"]').tooltip()
                // Setup the individual timelines
                $('#resultsTable tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = resultsTable.row(tr);
                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                        $(this).find("i").removeClass("fa-caret-down")
                        $(this).find("i").addClass("fa-caret-right")
                    } else {
                        // Open this row
                        $(this).find("i").removeClass("fa-caret-right")
                        $(this).find("i").addClass("fa-caret-down")
                        row.child(renderTimeline(row.data())).show();
                        tr.addClass('shown');
                    }
                });
                // Setup the graphs
                $.each(campaign.timeline, function (i, event) {
                    if (event.message == "Campaign Created") {
                        return true
                    }
                    var event_date = moment.utc(event.time).local()
                    timeline_series_data.push({
                        email: event.email,
                        message: event.message,
                        x: event_date.valueOf(),
                        y: 1,
                        marker: {
                            fillColor: statuses[event.message].color
                        }
                    })
                })
                renderTimelineChart({
                    data: timeline_series_data
                })
                $.each(email_series_data, function (status, count) {
                    var email_data = []
                    if (!(status in statusMapping)) {
                        return true
                    }
                    email_data.push({
                        name: status,
                        y: Math.floor((count / campaign.results.length) * 100),
                        count: count
                    })
                    email_data.push({
                        name: '',
                        y: 100 - Math.floor((count / campaign.results.length) * 100)
                    })
                    var chart = renderPieChart({
                        elemId: statusMapping[status] + '_chart',
                        title: status,
                        name: status,
                        data: email_data,
                        colors: [statuses[status].color, '#dddddd']
                    })
                })
                performCharting(email_series_data)
  
            }
        })
        .error(function () {
            $("#loading").hide()
            errorFlash(" Campaign not found!")
        })
}

function performCharting(email_series_data)
{
    let submitted_Data = "Submitted Data";
    let clicked_Link = "Clicked Link";
    let did_download = "Downloaded File";
    let downloads = email_series_data[did_download]
    let default_formatter = function() {
        return this.y + '%';
    };
    let total_Data = "Email Sent";
    let submitted_amount = email_series_data[submitted_Data];
    let clicked_amount = email_series_data[clicked_Link];
    console.log(campaign);
    console.log(campaign.results.length);
    let total_amount = campaign.results.length;

    //Clicks vs Submitted Data


    console.log(Math.floor(submitted_amount / clicked_amount) * 100);
    let prepClicked = {
        name: 'Clicked Link',
        y: Math.floor(((clicked_amount-submitted_amount) / clicked_amount) * 100),
        count: clicked_amount-submitted_amount
    }
    let prepSubmitted = {
        name: 'Submitted Data',
        y: Math.round((submitted_amount / clicked_amount) * 100),
        count: submitted_amount
    }
    let title_clicked_vs_submitted = ""+prepSubmitted.y+"% ("+prepSubmitted.count+") of the users who clicked the link submitted data whereas "+prepClicked.y+"% ("+prepClicked.count+") of users only clicked the link";
    let clicked_vs_submitted = {
        elemId:'clicked_vs_submitted_chart',
        title: 'Clicked Link vs Submitted Data',
        name: 'Clicked Link vs Submitted Data',
        colors: [statuses[submitted_Data].color, statuses[clicked_Link].color],
        formatter: default_formatter,
        data: [prepSubmitted, prepClicked],
        credits: title_clicked_vs_submitted
    }
    renderSpecificPercentage(clicked_vs_submitted);

    //Clicked vs opened sent_vs_clicked_chart
    let clicked_links = {
        name: 'Clicked Link',
        y: Math.floor(clicked_amount / total_amount * 100),
        count: submitted_amount
    }
    let no_interaction = {
        name: 'No interaction',
        y: Math.floor(((total_amount-clicked_amount) / total_amount) * 100),
        count: total_amount-clicked_amount
    }

    let title_sent_vs_clicked = ""+clicked_links.y+"% ("+clicked_links.count+") of the users who received the mail clicked the link, "+no_interaction.y+"% ("+no_interaction.count+") of users did not interact with the email.";
    let sent_vs_clicked = {
        elemId:'sent_vs_clicked_chart',
        title: 'Overview of the interaction with the phishing mail',
        name: 'Overview of the interaction with the phishing mail',
        colors: [statuses[total_Data].color, statuses[clicked_Link].color],
        formatter: default_formatter,
        data: [no_interaction, clicked_links],
        credits: title_sent_vs_clicked
    }
    renderSpecificPercentage(sent_vs_clicked)

    //Do Position Specific Stuff
    let position_data = {};
    /*
        position_data = {
            "Position1": {
                "Submitted Data": 1
                "Clicked Link": 2
            }
            "Position2": {
                "Submitted Data": 1
                "Clicked Link":15
            }
        }
    */
        let known_mails = [];
        $.each(campaign.results, function (i, result) {
            if(known_mails.indexOf(result.email == -1)){
                if(!position_data.hasOwnProperty(result.position)){
                    position_data[result.position] = {};
                    position_data[result.position]["name"] = result.position;
                    position_data[result.position][clicked_Link] = 0;
                    position_data[result.position][submitted_Data] =0;
                    position_data[result.position][did_download] =0;
                }
                let evs = groupEventsByEmail(campaign.timeline);
                $.each(evs, (i,g) => {

                if(hasPropertyValue(g, "message", clicked_Link)){
                        position_data[result.position][clicked_Link]++;
                }
                if(hasPropertyValue(g,"message", submitted_Data)){
                        position_data[result.position][submitted_Data]++;
                }

                if(hasPropertyValue(g,"message", did_download)){
                    position_data[result.position][did_download]++;
                }
            })
            }    
        });
        //For clicks
        if(clicked_amount != 0){
            let data = []
            let click_pos_credits = "Following clicks were observed for each position:<br> ";
            let count = 0;
            $.each(position_data,(i,p) => {
                if(p[clicked_Link] != 0){
                    let spec = {name: p.name, y: (p[clicked_Link]/clicked_amount*100), count: p[clicked_Link]};
                    click_pos_credits += "<span style=\"color:"+predefinedColors[count]+"\">"+p.name+": "+spec.y+"%"+"("+spec.count+")</span><br>";
                    data.push(spec);
                }
                count++;
            });
            click_pos_credits += ""
            let clicked_per_position = {
                elemId:'clicked_position_chart',
                title: 'Overview of the clicks per position',
                name: 'Overview of the clicks per position',
                colors: predefinedColors,
                formatter: function () {return this.y+"%" +"<br>("+this.key+")"},
                data: data,
                credits: ""
            };
            renderSpecificPercentage(clicked_per_position);
            document.getElementById('clicked_position_text').innerHTML = click_pos_credits;
        }


        //for Submissions
        /*if(submitted_amount != 0){
            let sub_pos_data = []
            let sub_pos_credits = "Following data submissions were observed for each position:<br> ";
            count = 0;
            $.each(position_data,(i,p) => {
                if(p[submitted_Data] != 0){
                    let spec = {name: p.name, y: (p[submitted_Data]/submitted_amount*100), count: p[submitted_Data]};
                    sub_pos_data += "<span style=\"color:"+predefinedColors[count]+"\">"+p.name+": "+spec.y+"%"+"("+spec.count+")</span><br>";
                    data.push(spec);
                }
                count++;
            });
            click_pos_credits += ""
            let sub_per_position = {
                elemId:'sub_position_chart',
                title: 'Overview of the submissions per position',
                name: 'Overview of the submissions per position',
                colors: predefinedColors,
                formatter: function () {return this.y+"%" +"<br>("+this.key+")"},
                data: sub_pos_data,
                credits: ""
            };
            renderSpecificPercentage(sub_per_position);
            document.getElementById('sub_position_text').innerHTML = sub_pos_credits;
        }
        
        //for downloads
        if(downloads != 0){
            let down_pos_data = []
            let down_pos_credits = "Following downloads were observed for each position:<br> ";
            count = 0;
            $.each(position_data,(i,p) => {
                if(p[did_download] != 0){
                    let spec = {name: p.name, y: (p[did_download]/downloads*100), count: p[did_download]};
                    sub_pos_data += "<span style=\"color:"+predefinedColors[count]+"\">"+p.name+": "+spec.y+"%"+"("+spec.count+")</span><br>";
                    data.push(spec);
                }
                count++;
            });
            click_pos_credits += ""
            let sub_per_position = {
                elemId:'sub_position_chart',
                title: 'Overview of the submissions per position',
                name: 'Overview of the submissions per position',
                colors: predefinedColors,
                formatter: function () {return this.y+"%" +"<br>("+this.key+")"},
                data: sub_pos_data,
                credits: ""
            };
            renderSpecificPercentage(sub_per_position);
            document.getElementById('sub_position_text').innerHTML = sub_pos_credits;*/
        
}
var setRefresh;

function refresh() {
    if (!doPoll) {
        return;
    }
    poll()
    clearTimeout(setRefresh)
    setRefresh = setTimeout(refresh, 60000)
};

function report_mail(rid, cid) {
    Swal.fire({
        title: "Are you sure?",
        text: "This result will be flagged as reported (RID: " + rid + ")",
        type: "question",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Continue",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        showLoaderOnConfirm: true
    }).then(function (result) {
        if (result.value){
            api.campaignId.get(cid).success((function(c) {
                report_url = new URL(c.url)
                report_url.pathname = '/report'
                report_url.search = "?rid=" + rid 
                fetch(report_url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    refresh();
                })
                .catch(error => {
                    let errorMessage = error.message;
                    if (error.message === "Failed to fetch") {
                        errorMessage = "This might be due to Mixed Content issues or network problems.";
                    }
                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        type: 'error',
                        confirmButtonText: 'Close'
                    });
                });
            }));
        }
    })
}

$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    })
    load();

    // Start the polling loop
    setRefresh = setTimeout(refresh, 60000)
})
