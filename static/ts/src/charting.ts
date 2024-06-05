const Highcharts = require("highcharts");
export module Charting{
    export function renderTimelineChart(chartopts){
        return Highcharts.chart('timeline_chart', {
            chart: {
                zoomType: 'x',
                type: 'line',
                height: "200px"
            },
            title: {
                text: 'Campaign Timeline'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    second: '%l:%M:%S',
                    minute: '%l:%M',
                    hour: '%l:%M',
                    day: '%b %d, %Y',
                    week: '%b %d, %Y',
                    month: '%b %Y'
                }
            },
            yAxis: {
                min: 0,
                max: 2,
                visible: false,
                tickInterval: 1,
                labels: {
                    enabled: false
                },
                title: {
                    text: ""
                }
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%A, %b %d %l:%M:%S %P', new Date(this.x)) +
                        '<br>Event: ' + this.point.message + '<br>Email: <b>' + this.point.email + '</b>'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 3
                    },
                    cursor: 'pointer',
                },
                line: {
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                data: chartopts['data'],
                dashStyle: "shortdash",
                color: "#cccccc",
                lineWidth: 1,
                turboThreshold: 0
            }]
        });
    }
    export class DataSet{
        count: number = 0;
        name: string = "";
        y : number = 0;
    }
    export class ChartOptions{
        html_anchor: string ="";
        text_anchor: string = "middle";
        font_size: string = "24px";
        font_weight: string = "bold";
        font_family: string = "Helvetica,Arial,sans-serif";
        title: string = "";
        innerSize: string = "80%";
        colors: string[] = [];
        data: DataSet[]=[];
        formatter: () => void = () => {};
        renderer: (set: DataSet) => string = () => {return ""};
    }
    export function renderPie(options: ChartOptions){
        return Highcharts.chart(options.html_anchor, {
            chart: {
                type: 'pie',
                events: {
                    load: function () {
                        var chart = this,
                            rend = chart.renderer,
                            pie = chart.series[0],
                            left = chart.plotLeft + pie.center[0],
                            top = chart.plotTop + pie.center[1];
                        this.innerText = rend.text(options.data[0].count, left, top).
                        attr({
                            'text-anchor': options.text_anchor,
                            'font-size': options.font_size,
                            'font-weight': options.font_weight,
                            'fill': options.colors[0],
                            'font-family': options.font_family
                        }).add();
                    },
                    render: options.renderer
                }
            },
            title: {
                text: options.title
            },
            plotOptions: {
                pie: {
                    innerSize: options.innerSize,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter:options.formatter
            },
            series: [{
                data: options.data,
                colors: options.colors,
            }]
        });
    }
}

