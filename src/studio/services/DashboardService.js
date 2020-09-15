import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

const REGEX_API_PARAM = /[^{]+(?=})/g

export const dashboardService = {
    getDashboards, createDashboard, getDashboard, getDashboardData, updateDashboard, shareDashboard, deleteDashboard
};

function getDashboards(solutionId, userId) {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard/user/${userId}`);
}

function createDashboard(solutionId, dashboard) {
    dashboard.solutionId = solutionId || 'system';
    return requestHandler.submit(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard`, dashboard);
}

function getDashboard(solutionId, dashboardId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard/${dashboardId}`);
}

function updateDashboard(solutionId, dashboard) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard/${dashboard.id}`, dashboard);
}

function shareDashboard(solutionId, dashboardId, payload) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard/${dashboardId}/share`, payload);
}

function deleteDashboard(solutionId, dashboardId) {
    return requestHandler.remove(`${ServiceConstants.HOST_SOLUTION}/api/solution/${solutionId || 'system'}/dashboard/${dashboardId}`);
}

function getDashboardData(dataSource) {
    let url = (dataSource.host || '') + dataSource.path
    let payload = {};
    if (dataSource.params && Object.keys(dataSource.params).length > 0) {
        let pathMatch = dataSource.path.match(REGEX_API_PARAM) || [];
        let pathParams = Object.keys(dataSource.params).filter(param => pathMatch.indexOf(param) >= 0);
        let queryParams = Object.keys(dataSource.params).filter(param => pathMatch.indexOf(param) < 0);

        pathParams.forEach(param => {
            url = url.replace('{' + param + '}', dataSource.params[param])
        })
        if ('POST' === dataSource.method || 'PUT' === dataSource.method) {
            queryParams.forEach(param => {
                payload[param] = dataSource.params[param];
            });
        } else {
            queryParams.forEach((param, paramIndex) => {
                url = url + (paramIndex === 0 ? '?' : '&') + param + '=' + dataSource.params[param]
            })
        }
    }

    if (dataSource.path.startsWith('/local/data/')) {
        return Promise.resolve(JSON.parse(JSON.stringify(DASHBOARD_DATA[url] || [])));
    } else if (ServiceConstants.HOST_PROCESS_ENGINE === dataSource.host) {
        if ('POST' === dataSource.method) {
            return requestHandler.submit(url, payload, { authType: 'ProcessEngine' })
        } else if ('PUT' === dataSource.method) {
            return requestHandler.update(url, payload, { authType: 'ProcessEngine' })
        } else {
            return requestHandler.fetch(url, { authType: 'ProcessEngine' })
        }
    } else {
        if ('POST' === dataSource.method) {
            return requestHandler.submit(url, payload)
        } else if ('PUT' === dataSource.method) {
            return requestHandler.update(url, payload)
        } else {
            return requestHandler.fetch(`${url}`)
        }
    }
}

// const DASHBOARDS = [
//     {
//         id: '01a6cba4-dcaa-4f69-bc13-8e0687ee0516',
//         name: 'Sample Charts',
//         default: true,
//         content: [
//             {
//                 id: "08a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'AreaChart',
//                 dataSource: {
//                     path: "/local/data/chart/08a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     title: 'Comparison'
//                 }
//             },
//             {
//                 id: "09a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'proportion',
//                 type: '',
//                 dataSource: {
//                     path: "/local/data/chart/09a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     title: 'Proportion'
//                 }
//             },
//             {
//                 id: "10a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'difference',
//                 type: "PieChart",
//                 dataSource: {
//                     path: "/local/data/chart/10a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     title: 'Difference'
//                 }
//             },
//             {
//                 id: "11a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'dimension',
//                 type: 'BubbleChart',
//                 dataSource: {
//                     path: "/local/data/chart/11a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     title: 'Dimension'
//                 }
//             },
//             {
//                 id: "12a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'trend',
//                 type: 'ScatterChart',
//                 dataSource: {
//                     path: "/local/data/chart/12a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     title: 'Scatter with Trend Lines'
//                 }
//             },
//             {
//                 id: "13a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'Timeline',
//                 dataSource: {
//                     path: "/local/data/chart/13a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     timeline: {
//                         groupByRowLabel: false,
//                     },
//                 }
//             }
//         ],
//         layout: [
//             { "w": 4, "h": 6, "x": 0, "y": 0, "i": "08a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 4, "y": 0, "i": "09a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 4, "y": 6, "i": "12a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 8, "y": 6, "i": "13a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 8, "y": 0, "i": "10a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 0, "y": 6, "i": "11a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false }
//         ]
//     },
//     {
//         id: '02a6cba4-dcaa-4f69-bc13-8e0687ee0516',
//         name: 'Other Charts',
//         default: false,
//         content: [
//             {
//                 id: "14a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'apex-charts',
//                 group: 'comparison',
//                 type: 'radar',
//                 dataSource: {
//                     path: "/local/data/chart/14a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     dataLabels: {
//                         enabled: false
//                     },
//                     labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//                     plotOptions: {
//                         radar: {
//                             size: 140,
//                             polygons: {
//                                 strokeColor: '#f3f6ff',
//                                 fill: {
//                                     colors: ['#f3f6ff', '#fff']
//                                 }
//                             }
//                         }
//                     },
//                     title: {
//                         text: 'Radar with Polygon Fill'
//                     },
//                     colors: ['#ff5252'],
//                     markers: {
//                         size: 4,
//                         colors: ['#fff'],
//                         strokeColor: '#ff5252',
//                         strokeWidth: 2,
//                     },
//                     tooltip: {
//                         y: {
//                             formatter: (val) => val
//                         }
//                     },
//                     yaxis: {
//                         tickAmount: 7,
//                         labels: {
//                             formatter: (val, i) => {
//                                 if (i % 2 === 0) {
//                                     return val;
//                                 } else {
//                                     return '';
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 id: "15a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'apex-charts',
//                 group: 'comparison',
//                 type: 'radar',
//                 dataSource: {
//                     path: "/local/data/chart/15a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     chart: {
//                         dropShadow: {
//                             enabled: true,
//                             blur: 1,
//                             left: 1,
//                             top: 1
//                         }
//                     },
//                     dataLabels: {
//                         enabled: false
//                     },
//                     title: {
//                         text: 'Radar Chart - Multi Series'
//                     },
//                     colors: ['#4680ff', '#0e9e4a', '#ff5252'],
//                     stroke: {
//                         width: 0
//                     },
//                     fill: {
//                         opacity: 0.7
//                     },
//                     markers: {
//                         size: 0
//                     },
//                     labels: ['2011', '2012', '2013', '2014', '2015', '2016']
//                 }
//             },
//             {
//                 id: "16a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'apex-charts',
//                 group: 'comparison',
//                 type: 'radialBar',
//                 dataSource: {
//                     path: "/local/data/chart/16a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     dataLabels: {
//                         enabled: false
//                     },
//                     plotOptions: {
//                         radialBar: {
//                             hollow: {
//                                 size: '70%',
//                             }
//                         },
//                     },
//                     colors: ['#4680ff'],
//                     labels: ['Active variants'],
//                 }
//             },
//             {
//                 id: "17a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'apex-charts',
//                 group: 'comparison',
//                 type: 'radialBar',
//                 dataSource: {
//                     path: "/local/data/chart/17a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     dataLabels: {
//                         enabled: false
//                     },
//                     plotOptions: {
//                         radialBar: {
//                             offsetY: -30,
//                             startAngle: 0,
//                             endAngle: 270,
//                             hollow: {
//                                 margin: 5,
//                                 size: '30%',
//                                 background: 'transparent',
//                                 image: undefined,
//                             },
//                             dataLabels: {
//                                 name: {
//                                     show: false,

//                                 },
//                                 value: {
//                                     show: false,
//                                 }
//                             }
//                         }
//                     },
//                     colors: ['#4680ff', '#0e9e4a', '#ffa21d', '#ff5252'],
//                     labels: ['Vimeo', 'Messenger', 'Facebook', 'LinkedIn'],
//                     legend: {
//                         show: true,
//                         floating: true,
//                         fontSize: '16px',
//                         position: 'left',
//                         offsetX: 0,
//                         offsetY: 0,
//                         labels: {
//                             useSeriesColors: true,
//                         },
//                         markers: {
//                             size: 0
//                         },
//                         formatter: (seriesName, opts) => seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex],
//                         itemMargin: {
//                             horizontal: 1,
//                         }
//                     },
//                     responsive: [{
//                         breakpoint: 480,
//                         options: {
//                             legend: {
//                                 show: false
//                             }
//                         }
//                     }]
//                 }
//             },
//             {
//                 id: "18a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'apex-charts',
//                 group: 'comparison',
//                 type: 'heatmap',
//                 dataSource: {
//                     path: "/local/data/chart/18a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     dataLabels: {
//                         enabled: false
//                     },
//                     colors: ['#4680ff'],
//                     title: {
//                         text: 'HeatMap Chart (Single color)'
//                     },
//                 }
//             }
//         ],
//         layout: [
//             { "w": 4, "h": 9, "x": 0, "y": 0, "i": "14a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 9, "x": 4, "y": 0, "i": "15a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 11, "x": 8, "y": 0, "i": "16a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 10, "x": 0, "y": 9, "i": "17a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 10, "x": 4, "y": 9, "i": "18a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false }
//         ]
//     },
//     {
//         id: '03a6cba4-dcaa-4f69-bc13-8e0687ee0516',
//         name: 'Social Metrics',
//         default: false,
//         content: [
//             {
//                 id: "01a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'LineChart',
//                 dataSource: {
//                     path: "/local/data/chart/01a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "title": "Number of responses",
//                     "chartArea": {
//                         "width": "80%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     "hAxis": {
//                         "title": "",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#FFFFFF"
//                         },
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#FFFFFF"
//                         }
//                     },
//                     "vAxis": {
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "baselineColor": "#FFFFFF",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#FFFFFF"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#FFFFFF"
//                         }
//                     },
//                     "isStacked": false
//                 }
//             },
//             {
//                 id: "02a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'BarChart',
//                 dataSource: {
//                     path: "/local/data/chart/02a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "title": "Top 5 Listings This Week",
//                     "titleTextStyle": {
//                         "fontSize": '14'
//                     },
//                     "bar": {
//                         "groupWidth": "70%"
//                     },
//                     "chartArea": {
//                         "width": "80%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     "hAxis": {
//                         "title": "",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#FFFFFF"
//                         },
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "baselineColor": "#FFFFFF",
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#FFFFFF"
//                         }
//                     },
//                     "vAxis": {
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "textPosition": 'in',
//                         "format": 'short',
//                         "baselineColor": "#FFFFFF",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "black"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "colors": [
//                         "#3e98de",
//                         "#c22144"
//                     ],
//                     "isStacked": false
//                 }
//             },
//             {
//                 id: "03a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'LineChart',
//                 dataSource: {
//                     path: "/local/data/chart/03a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: true,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "title": "Net promoter score by source",
//                     "backgroundColor": {
//                         "stroke": "#ccc",
//                         "strokeWidth": "1.5",
//                         "fill": "#FFFFFF"
//                     },
//                     "chartArea": {
//                         "width": "90%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     "hAxis": {
//                         "title": "May",
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "vAxis": {
//                         "title": "",
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "ticks": [0, 20, 40, 60, 80],
//                         "baselineColor": "#ccc",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "curveType": "none",
//                     "pointSize": 0,
//                     "legend": {
//                         "position": "top",
//                         "textStyle": {
//                             "fontSize": 8,
//                             "color": "#ccc"
//                         },
//                         "alignment": "start"
//                     },
//                     "colors": [
//                         "#2cbedb",
//                         "#c22144"
//                     ],
//                     "isStacked": false,
//                     "annotations": {
//                         "style": "point"
//                     }
//                 }
//             },
//             {
//                 id: "04a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'ColumnChart',
//                 dataSource: {
//                     path: "/local/data/chart/04a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: true,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "title": "NPS by product categories compared with previous period",
//                     "backgroundColor": {
//                         "stroke": "#ccc",
//                         "strokeWidth": "1.5",
//                         "fill": "#FFFFFF"
//                     },
//                     "bar": {
//                         "groupWidth": "20%"
//                     },
//                     "chartArea": {
//                         "width": "90%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     "hAxis": {
//                         "title": "",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "vAxis": {
//                         "title": "",
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "ticks": [-10, 0, 10, 20, 30],
//                         "baselineColor": "#ccc",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "legend": {
//                         "position": "top",
//                         "textStyle": {
//                             "fontSize": 8,
//                             "color": "#ccc"
//                         },
//                         "alignment": "start"
//                     },
//                     "colors": [
//                         "#3e98de",
//                         "#c22144"
//                     ],
//                     "isStacked": false
//                 }
//             },
//             {
//                 id: "05a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'dimension',
//                 type: 'BubbleChart',
//                 dataSource: {
//                     path: "/local/data/chart/05a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLabel: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     title: 'Overall sentiment Analysis',
//                     "hAxis": {
//                         "title": "",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#FFFFFF"
//                         },
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "baselineColor": "#FFFFFF",
//                         "gridlines": {
//                             "color": "#FFFFFF"
//                         }
//                     },
//                     "vAxis": {
//                         "titleTextStyle": {
//                             "color": "#FFFFFF"
//                         },
//                         "baselineColor": "#FFFFFF",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#FFFFFF"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#FFFFFF"
//                         }
//                     },
//                     bubble: { textStyle: { fontSize: 10, auraColor: 'none' } },
//                     colors: ['#93f291', "#e87166"]
//                 }
//             },
//             {
//                 id: "06a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'comparison',
//                 type: 'AreaChart',
//                 dataSource: {
//                     path: "/local/data/chart/06a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "chartArea": {
//                         "width": "80%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     "hAxis": {
//                         "title": "Feb",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "vAxis": {
//                         "titleTextStyle": {
//                             "color": "#ccc"
//                         },
//                         "format": 'short',
//                         "baselineColor": "#ccc",
//                         "textStyle": {
//                             "fontName": "Arial",
//                             "color": "#ccc"
//                         },
//                         "minValue": 0,
//                         "gridlines": {
//                             "color": "#ccc"
//                         }
//                     },
//                     "isStacked": 'absolute'
//                 }
//             },
//             {
//                 id: "07a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'google-charts',
//                 group: 'trend',
//                 type: 'CandlestickChart',
//                 dataSource: {
//                     path: "/local/data/chart/07a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET'
//                 },
//                 options: {
//                     showTitle: true,
//                     showLegend: false,
//                     showCategoryAxis: true,
//                     showValueAxis: true,
//                     "title": 'Net promoter score',
//                     "chartArea": {
//                         "width": "80%",
//                         "backgroundColor": {
//                             "stroke": "#ccc",
//                             "strokeWidth": 0,
//                             "fill": "#FFFFFF"
//                         }
//                     },
//                     candlestick: {
//                         fallingColor: { strokeWidth: 0, fill: '#a52714' },
//                         risingColor: { strokeWidth: 0, fill: '#0f9d58' },
//                     },
//                     bar: { groupWidth: '40%' },
//                     hAxis: {
//                         baselineColor: '#ccc',
//                         ticks: [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100]
//                     },
//                     orientation: 'vertical'
//                 }
//             }
//         ],
//         layout: [
//             { "w": 4, "h": 6, "x": 0, "y": 0, "i": "01a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 4, "y": 0, "i": "02a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 8, "y": 0, "i": "03a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 0, "y": 6, "i": "04a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 4, "y": 6, "i": "05a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 8, "y": 6, "i": "06a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false },
//             { "w": 4, "h": 6, "x": 0, "y": 12, "i": "07a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false }
//         ]
//     },
//     {
//         id: '09a6cba4-dcaa-4f69-bc13-8e0687ee0516',
//         name: 'My Tasks',
//         default: false,
//         content: [
//             {
//                 id: "19a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                 provider: 'studio-dashboard',
//                 group: 'data-table',
//                 dataSource: {
//                     host: '',
//                     path: "/local/data/api/19a6cba4-dcaa-4f69-bc13-8e0687ee0516",
//                     method: 'GET',
//                     params: [],
//                     labels: [
//                         { key: 'name', label: 'Name', selected: true },
//                         { key: 'created', label: 'Created', selected: true },
//                         { key: 'followUp', label: 'Follow Up', selected: true },
//                         { key: 'due', label: 'Due', selected: true },
//                         { key: 'assignee', label: 'Assignee', selected: true }
//                     ],
//                 },
//                 options: {
//                     title: 'Tasks',
//                     order: { sortIndex: 1, sortOrder: 1 }
//                 }
//             }
//         ],
//         layout: [
//             { "w": 12, "h": 9, "x": 0, "y": 9, "i": "19a6cba4-dcaa-4f69-bc13-8e0687ee0516", "moved": false, "static": false }
//         ]
//     }
// ]

const DASHBOARD_DATA = {
    '/local/data/chart/01a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ["Dates", "Data"],
        ['', 12], ['', 20], ['', 8], ['', 12], ['', 9], ['', 13], ['', 8], ['', 15], ['', 4], ['', 14], ['', 16], ['', 5], ['', 20], ['', 16], ['', 22]
    ],
    '/local/data/api/01a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { date: '01-Jan-2020', count: 12 },
        { date: '02-Jan-2020', count: 20 },
        { date: '03-Jan-2020', count: 8 },
        { date: '04-Jan-2020', count: 12 },
        { date: '05-Jan-2020', count: 9 },
        { date: '06-Jan-2020', count: 13 },
        { date: '07-Jan-2020', count: 8 },
        { date: '08-Jan-2020', count: 15 },
        { date: '09-Jan-2020', count: 4 },
        { date: '10-Jan-2020', count: 14 },
        { date: '11-Jan-2020', count: 16 },
        { date: '12-Jan-2020', count: 5 },
        { date: '13-Jan-2020', count: 20 },
        { date: '14-Jan-2020', count: 16 },
        { date: '15-Jan-2020', count: 22 }
    ],
    '/local/data/chart/02a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['haxis', 'Value1', 'Value2'],
        ['Samsung', 35, 40], ['Walmart', 25, 30], ['Bestbuy', 25, 20], ['Samsung', 10, 15]
    ],
    '/local/data/api/02a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { scraper: 'Samsung', series1: 35, series2: 40 },
        { scraper: 'Walmart', series1: 25, series2: 30 },
        { scraper: 'BestBuy', series1: 25, series2: 20 },
        { scraper: 'Amazon', series1: 10, series2: 16 }
    ],
    '/local/data/chart/03a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['Dates', 'Online Surveys', { type: 'string', role: 'annotation' }, 'Email Campaigns', { type: 'string', role: 'annotation' }],
        ['25', 31, '$31', 39, '$39'], ['26', 20, '20', 43, '43'], ['27', 33, '33', 40, '40'], ['28', 54, '54', 59, '59'], ['29', 46, '46', 41, '41'],
        ['30', 50, '50', 36, '36'], ['1', 49, '49', 37, '37'], ['2', 59, '59', 38, '38'], ['3', 47, '47', 32, '32'], ['4', 55, '55', 39, '39'],
        ['5', 57, '57', 18, '18'], ['6', 64, '64', 19, '19'], ['7', 54, '54', 7, '7'], ['8', 58, '58', 9, '9'], ['9', 53, '53', 5, '5']
    ],
    '/local/data/api/03a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { date: '25', online: 31, email: 39 },
        { date: '26', online: 20, email: 43 },
        { date: '27', online: 33, email: 40 },
        { date: '28', online: 54, email: 59 },
        { date: '29', online: 46, email: 41 },
        { date: '30', online: 50, email: 36 },
        { date: '01', online: 49, email: 37 },
        { date: '02', online: 59, email: 38 },
        { date: '03', online: 47, email: 32 },
        { date: '04', online: 55, email: 39 },
        { date: '05', online: 57, email: 18 },
        { date: '06', online: 64, email: 19 },
        { date: '07', online: 54, email: 7 },
        { date: '08', online: 58, email: 9 },
        { date: '09', online: 53, email: 5 }
    ],
    '/local/data/chart/04a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ["Items", "New Zealand", "Hong Kong"],
        ["Health and Household", -5, -7],
        ["Home Audio", -6, 15],
        ["Office Electronics", 22, 15],
        ["Service Plans", 17, 14],
        ["Messenger Bags", 18, 13],
        ["Download Store", 12, 15]
    ],
    '/local/data/api/04a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { category: 'Health and Household', nz: -5, hk: -7 },
        { category: 'Home Audio', nz: -6, hk: 15 },
        { category: 'Office Electronics', nz: 22, hk: 15 },
        { category: 'Service Plans', nz: 17, hk: 14 },
        { category: 'Messenger Bags', nz: 18, hk: 13 },
        { category: 'Download Store', nz: 12, hk: 15 }
    ],
    '/local/data/chart/05a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['ID', 'X', 'Y', 'Series'],
        ['High price', 78, 184, 'Very positive'],
        ['Credit card', 68, 125, 'Very negative'],
        ['Ship item', 72, 440, 'Very positive'],
        ['Wait time', 72, 170, 'Very negative'],
        ['Send email', 68, 460, 'Very positive']
    ],
    '/local/data/api/05a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { category: 'High Price', x: 78, y: 184, series: 'Very Positive' },
        { category: 'Credit Card', x: 68, y: 125, series: 'Very Negative' },
        { category: 'Ship Item', x: 72, y: 440, series: 'Very Positive' },
        { category: 'Wait Time', x: 72, y: 170, series: 'Very Negative' },
        { category: 'Send Email', x: 68, y: 460, series: 'Very Positive' }
    ],
    '/local/data/chart/06a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ["Dates", "Hong Kong", "Germany", "New Zealand"],
        ['16', 0, 0, 0], ['17', 100, 200, 500], ['18', 150, 220, 420], ['19', 190, 250, 470], ['20', 200, 300, 700], ['21', 270, 420, 650],
        ['22', 175, 450, 620], ['23', 380, 660, 1100], ['24', 300, 510, 870], ['25', 70, 500, 910], ['26', 160, 480, 910], ['27', 500, 630, 950],
        ['28', 290, 510, 1050], ['29', 250, 560, 1000], ['30', 300, 500, 920], ['31', 200, 700, 1050], ['1', 250, 650, 980], ['2', 340, 700, 940],
        ['3', 280, 640, 940], ['4', 300, 700, 1159], ['5', 300, 650, 950], ['6', 170, 570, 970], ['7', 300, 700, 900], ['8', 500, 800, 1200],
        ['9', 300, 700, 900], ['10', 300, 700, 900]
    ],
    '/local/data/api/06a6cba4-dcaa-4f69-bc13-8e0687ee0516': [],
    '/local/data/chart/07a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['day', 'a', 'b', 'c', 'd'],
        ['', -100, -100, -60, -60], ['', -60, -60, -38, -38], ['', -38, -38, -18, -18], ['', -18, -18, -2, -2],
        ['', -2, -2, 27, 27], ['', 60, 60, 27, 27], ['', 80, 80, 60, 60], ['', 100, 100, 80, 80],
    ],
    '/local/data/api/07a6cba4-dcaa-4f69-bc13-8e0687ee0516': [],
    '/local/data/chart/08a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['Year', 'Sales', 'Expenses'],
        ['2013', 1000, 400],
        ['2014', 1170, 460],
        ['2015', 660, 1120],
        ['2016', 1030, 540],
    ],
    '/local/data/chart/09a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['Task', 'Cases per Day'],
        ['Normal', 8],
        ['Low', 2],
        ['High', 4],
    ],
    '/local/data/api/09a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { task: 'Normal', cases: 8 },
        { task: 'Low', cases: 2 },
        { task: 'High', cases: 4 }
    ],
    '/local/data/chart/10a6cba4-dcaa-4f69-bc13-8e0687ee0516': {
        old: [
            ['Major', 'Degrees'],
            ['Business', 256070],
            ['Education', 108034],
            ['Social', 127101],
            ['Health', 181863],
            ['Psychology', 274194],
        ],
        new: [
            ['Major', 'Degrees'],
            ['Business', 356071],
            ['Education', 208032],
            ['Social', 227103],
            ['Health', 391864],
            ['Psychology', 484195],
        ],
    },
    '/local/data/chart/11a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['ID', 'Life Expectancy', 'Fertility Rate', 'Region', 'Population'],
        ['CAN', 80.66, 1.67, 'North America', 33739900],
        ['DEU', 79.84, 1.36, 'Europe', 81902307],
        ['DNK', 78.6, 1.84, 'Europe', 5523095],
        ['EGY', 72.73, 2.78, 'Middle East', 79716203],
        ['GBR', 80.05, 2, 'Europe', 61801570],
        ['IRN', 72.49, 1.7, 'Middle East', 73137148],
        ['IRQ', 68.09, 4.77, 'Middle East', 31090763],
        ['ISR', 81.55, 2.96, 'Middle East', 7485600],
        ['RUS', 68.6, 1.54, 'Europe', 141850000],
        ['USA', 78.09, 2.05, 'North America', 307007000]
    ],
    '/local/data/chart/12a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        ['Age', 'Weight'],
        [8, 12], [4, 5.5], [11, 14], [4, 5], [3, 3.5], [6.5, 7]
    ],
    '/local/data/chart/13a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        [
            { type: 'string', id: 'vAxis Label' },
            { type: 'string', id: 'Value' },
            { type: 'number', id: 'Start' },
            { type: 'number', id: 'End' },
        ],
        ['A', '+39.1', -100, -60],
        ['B', '+23.8', -60, -40],
        ['C', '+18.3', -40, -20],
        ['D', '+12.0', -40, -0],
        ['E', '+8.5', -10, -0],
        ['F', '+25.4', 0, 27],
        ['G', '-29.4', 27, 60],
    ],
    '/local/data/chart/14a6cba4-dcaa-4f69-bc13-8e0687ee0516': [{
        name: 'Series 1',
        data: [20, 100, 40, 30, 50, 80, 33],
    }],
    '/local/data/chart/15a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        {
            name: 'Series 1',
            data: [80, 50, 30, 40, 100, 20],
        }, {
            name: 'Series 2',
            data: [20, 30, 40, 80, 20, 80],
        }, {
            name: 'Series 3',
            data: [44, 76, 78, 13, 43, 10],
        }
    ],
    '/local/data/chart/16a6cba4-dcaa-4f69-bc13-8e0687ee0516': [70],
    '/local/data/chart/17a6cba4-dcaa-4f69-bc13-8e0687ee0516': [76, 67, 61, 90],
    '/local/data/chart/18a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        {
            name: 'Metric1',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric2',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric3',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric4',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric5',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric6',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric7',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric8',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        },
        {
            name: 'Metric9',
            data: generateDatasehratheat(12, {
                min: 0,
                max: 90
            })
        }
    ],
    '/local/data/api/19a6cba4-dcaa-4f69-bc13-8e0687ee0516': [
        { "name": "Approve Purchase Order", "assignee": null, "created": "2020-05-19T16:15:49.058+0000", "due": null, "followUp": null },
        { "name": "Assign Reviewer", "assignee": "admin", "created": "2020-06-08T10:51:27.361+0000", "due": null, "followUp": null },
        { "name": "Approve Purchase Order", "assignee": null, "created": "2020-05-19T15:54:26.482+0000", "due": null, "followUp": null },
        { "name": "Approve Purchase Order", "assignee": "admin", "created": "2020-05-12T11:52:27.833+0000", "due": null, "followUp": null },
        { "name": "Approve Purchase Order", "assignee": null, "created": "2020-05-19T16:17:00.840+0000", "due": null, "followUp": null },
        { "name": "Review", "assignee": null, "created": "2020-05-12T12:58:02.368+0000", "due": null, "followUp": null },
    ],
    '/local/data/api/19a6cba4-dcaa-4f69-bc13-8e0687ee0518': {
        "negative_explainability": [
            {
                "text": "not",
                "value": 3
            },
            {
                "text": "but",
                "value": 2
            },
            {
                "text": "no",
                "value": 1
            },
            {
                "text": "sure",
                "value": 1
            },
            {
                "text": "fails",
                "value": 1
            }
        ],
        "positive_explainability": [
            {
                "text": "great",
                "value": 3
            },
            {
                "text": "good",
                "value": 3
            },
            {
                "text": "amazon",
                "value": 2
            },
            {
                "text": "pretty",
                "value": 2
            },
            {
                "text": "like",
                "value": 2
            }
        ]
    }


}

function generateDatasehratheat(count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
        series.push({
            x: 'w' + (i + 1).toString(),
            y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
        });
        i++;
    }
    return series;
}
