import React from 'react';
import { Chart } from "react-google-charts";

export default function GoogleCharts(props) {
    let options = JSON.parse(JSON.stringify(props.options || {}));

    if (!!!options.showTitle) {
        delete options.title;
    }
    delete options.showTitle;

    if (!!!options.showLegend) {
        options.legend = 'none';
    }
    delete options.showLegend;

    if (!!!options.showCategoryAxis) {
        delete options.hAxis;
    }
    delete options.showCategoryAxis;

    if (!!!options.showValueAxis) {
        delete options.vAxis;
    }
    delete options.showValueAxis;

    if (!!!options.showTrendlines) {
        delete options.trendlines;
    }
    delete options.showTrendlines;

    if (!props.chartType) {
        return (<div className='chart-message'>Select Chart Type</div>)
    } else if (!props.data || props.data.length === 0) {
        return (<div className='chart-message'>No data</div>)
    } else if (props.group === 'difference') {
        return (
            <Chart chartType={props.chartType}
                width={'100%'} height={'100%'}
                loader={<div>Loading Chart</div>}
                options={options}
                diffdata={props.data || {}}
            />
        )
    } else {
        return (
            <Chart chartType={props.chartType}
                width={'100%'} height={'100%'}
                loader={<div>Loading Chart</div>}
                options={options}
                data={props.data || []}
            />
        )
    }
}