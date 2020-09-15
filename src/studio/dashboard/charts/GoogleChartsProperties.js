const CHART_SETTINGS = [
    { label: 'Heading', key: 'options.heading.title', inputType: 'text' },
    {
        label: 'Align Heading', key: 'options.heading.align', inputType: 'select',
        selectValues: [
            { value: 'text-left', label: 'Left' },
            { value: 'text-center', label: 'Center' },
            { value: 'text-right', label: 'Right' },
        ]
    },
    { label: 'Chart Type', key: 'type', inputType: 'select', selectReference: 'variations' }
]
const CHART_STACKED = [
    {
        label: 'Stacked', key: 'options.isStacked', inputType: 'select', selectValues: [
            { value: 'false', label: '' },
            { value: 'absolute', label: 'Stacked' },
            { value: 'relative', label: 'Stacked Relative' },
            { value: 'percent', label: 'Stacked Percentage' }
        ]
    }
]
const CHART_TITLE = [
    { label: 'Show Title', key: 'options.showTitle', inputType: 'checkbox' },
    { label: 'Title', key: 'options.title', depends: 'options.showTitle', inputType: 'text' },
    {
        label: 'Position', key: 'options.titlePosition', depends: 'options.showTitle', inputType: 'select',
        selectValues: [
            { value: 'out', label: 'Outside' },
            { value: 'in', label: 'Inside' },
            { value: 'none', label: 'Omit the title' },
        ]
    },
    { label: 'Font Size', key: 'options.titleTextStyle.fontSize', depends: 'options.showTitle', inputType: 'number' }
]
const CHART_LEGEND = [
    { label: 'Show Legend', key: 'options.showLegend', inputType: 'checkbox' },
    {
        label: 'Position', key: 'options.legend.position', depends: 'options.showLegend', inputType: 'select',
        selectValues: [
            { value: 'right', label: 'Right' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left', label: 'Left' },
            { value: 'in', label: 'Inside' },
            { value: 'none', label: 'Omit the legend' },
        ]
    },
    {
        label: 'Alignment', key: 'options.legend.alignment', depends: 'options.showLegend', inputType: 'select',
        selectValues: [
            { value: 'start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'End' }
        ]
    },
    { label: 'Max Lines', key: 'options.legend.maxLines', depends: 'options.showLegend', inputType: 'number' },
]
const CHART_CATEGORY_AXIS = [
    { label: 'Show Axis', key: 'options.showCategoryAxis', inputType: 'checkbox' },
    { label: 'Title', key: 'options.hAxis.title', depends: 'options.showCategoryAxis', inputType: 'text' },
    {
        label: 'Position', key: 'options.hAxis.textPosition', depends: 'options.showCategoryAxis', inputType: 'select',
        selectValues: [
            { value: 'out', label: 'Outside the chart area' },
            { value: 'in', label: 'Inside the chart area' },
            { value: 'none', label: 'Omit axis titles' }
        ]
    },
    { label: 'Grid Line Color', key: 'options.hAxis.gridlines.color', depends: 'options.showCategoryAxis', inputType: 'color' },
    // { label: 'Min Value', key: 'options.hAxis.minValue', depends: 'options.showCategoryAxis', inputType: 'number' },
    // { label: 'Max Value', key: 'options.hAxis.maxValue', depends: 'options.showCategoryAxis', inputType: 'number' }
]
const CHART_VALUE_AXIS = [
    { label: 'Show Axis', key: 'options.showValueAxis', inputType: 'checkbox' },
    { label: 'Title', key: 'options.vAxis.title', depends: 'options.showValueAxis', inputType: 'text' },
    {
        label: 'Position', key: 'options.vAxis.textPosition', depends: 'options.showValueAxis', inputType: 'select',
        selectValues: [
            { value: 'out', label: 'Outside the chart area' },
            { value: 'in', label: 'Inside the chart area' },
            { value: 'none', label: 'Omit axis titles' }
        ]
    },
    { label: 'Grid Line Color', key: 'options.vAxis.gridlines.color', depends: 'options.showValueAxis', inputType: 'color' },
    // { label: 'Min Value', key: 'options.vAxis.minValue', depends: 'options.showValueAxis', inputType: 'number' },
    // { label: 'Max Value', key: 'options.vAxis.maxValue', depends: 'options.showValueAxis', inputType: 'number' }
]
const CHART_TREND = [
    { label: 'Show Trend lines', key: 'options.showTrendlines', inputType: 'checkbox' },
    // { label: 'Visible in Legend', key: 'options.trendlines.0.visibleInLegend', depends: 'options.showTrendlines', inputType: 'checkbox' },
    { label: 'Line Width', key: 'options.trendlines.0.lineWidth', depends: 'options.showTrendlines', inputType: 'number' },
    { label: 'Opacity', key: 'options.trendlines.0.opacity', depends: 'options.showTrendlines', inputType: 'number' },
    { label: 'Label', key: 'options.trendlines.0.labelInLegend', depends: 'options.showTrendlines', inputType: 'text' },
    {
        label: 'Style', key: 'options.trendlines.0.type', depends: 'options.showTrendlines', inputType: 'select', selectValues: [
            { value: '', label: '' },
            { value: 'exponential', label: 'Exponential' },
            { value: 'polynomial', label: 'Polynomial' }
        ]
    },
    { label: 'Degree', key: 'options.trendlines.0.degree', depends: 'options.showTrendlines', inputType: 'number' },
    { label: 'Color', key: 'options.trendlines.0.color', depends: 'options.showTrendlines', inputType: 'color' },
]
const CHART_APPEARANCE = [
    { label: 'Chart area Width%', key: 'options.chartArea.width', inputType: 'text' },
    { label: 'Chart area Height%', key: 'options.chartArea.height', inputType: 'text' },
    {
        label: 'Color Scheme', key: 'options.colors', inputType: 'select', selectValues: [
            { value: '', label: 'Default' },
            { value: 'red,yellow', label: 'Fire' },
            { value: '#2E8B57,#5acc97', label: 'Sea Green' },
            { value: '#1E90FF,#ffc107', label: 'Bright Pastel' },
            { value: '#b0120a,#ffab91', label: 'Earth Tones' }
        ]
    },
    { label: 'Area Border Size', key: 'options.chartArea.backgroundColor.strokeWidth', inputType: 'number' },
    { label: 'Area Border Color', key: 'options.chartArea.backgroundColor.stroke', inputType: 'color' },
    { label: 'Area Background Color', key: 'options.chartArea.backgroundColor.fill', inputType: 'color' },
    { label: 'Chart Background Color', key: 'options.backgroundColor.fill', inputType: 'color' },
]
const CHART_ANNOTATION = [
    {
        label: 'Style', key: 'options.annotations.style', inputType: 'select', selectValues: [
            { value: 'point', label: 'Point' },
            { value: 'line', label: 'Line' }
        ]
    },
    { label: 'Box outline Color', key: 'options.annotations.boxStyle.stroke', inputType: 'color' },
    { label: 'Box outline Thickness', key: 'options.annotations.boxStyle.strokeWidth', inputType: 'number' },
    { label: 'x-radius of the corner curvature', key: 'options.annotations.boxStyle.rx', inputType: 'number' },
    { label: 'y-radius of the corner curvature', key: 'options.annotations.boxStyle.ry', inputType: 'number' },
]
const CHART_ANIMATION = [
    { label: 'Animate on the initial draw', key: 'options.animation.startup', inputType: 'checkbox' },
    { label: 'Duration', key: 'options.animation.duration', inputType: 'number' },
    {
        label: 'Duration', key: 'options.animation.easing', inputType: 'select', selectValues: [
            { value: 'linear', label: 'Constant Speed' },
            { value: 'in', label: 'Start slow and speed up' },
            { value: 'out', label: 'Start fast and slow down' },
            { value: 'inAndOut', label: 'Start slow, speed up, then slow down' }
        ]
    },
]

module.exports.PROPERTIES = {
    'google-charts': {
        'AreaChart': {
            'Basic Settings': CHART_SETTINGS.concat(CHART_STACKED).concat([{ label: 'Marker Size', key: 'options.pointSize', inputType: 'number' }]),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [{ label: 'Line Width', key: 'options.lineWidth', inputType: 'number' }].concat(CHART_APPEARANCE),
            'Annotation': CHART_ANNOTATION,
            'Animation': CHART_ANIMATION
        },
        'BarChart': {
            'Basic Settings': CHART_SETTINGS.concat(CHART_STACKED),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [{ label: 'Bar Width%', key: 'options.bar.groupWidth', inputType: 'text' }].concat(CHART_APPEARANCE),
            'Annotation': CHART_ANNOTATION,
            'Animation': CHART_ANIMATION
        },
        'BubbleChart': {
            'Basic Settings': CHART_SETTINGS,
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [
                { label: 'Bubble Font Size', key: 'options.bubble.textStyle.fontSize', inputType: 'number' }
            ].concat(CHART_APPEARANCE),
            'Animation': CHART_ANIMATION
        },
        'CandlestickChart': {
            'Basic Settings': CHART_SETTINGS,
            'Title': CHART_TITLE,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [
                { label: 'Bar Width%', key: 'options.bar.groupWidth', inputType: 'text' },
                {
                    label: 'Orientation', key: 'options.orientation', inputType: 'select', selectValues: [
                        { value: 'horizontal', label: 'Horizontal' },
                        { value: 'vertical', label: 'Vertical' }
                    ]
                },
                { label: 'Rising Stroke Color', key: 'options.candlestick.risingColor.fill', inputType: 'color' },
                { label: 'Rising Stroke Width', key: 'options.candlestick.risingColor.strokeWidth', inputType: 'number' },
                { label: 'Falling Stroke Color', key: 'options.candlestick.fallingColor.fill', inputType: 'color' },
                { label: 'Falling Stroke Width', key: 'options.candlestick.fallingColor.strokeWidth', inputType: 'number' }
            ].concat(CHART_APPEARANCE),
            'Animation': CHART_ANIMATION
        },
        'ColumnChart': {
            'Basic Settings': CHART_SETTINGS.concat(CHART_STACKED),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [{ label: 'Bar Width%', key: 'options.bar.groupWidth', inputType: 'text' }].concat(CHART_APPEARANCE),
            'Annotation': CHART_ANNOTATION,
            'Animation': CHART_ANIMATION
        },
        'LineChart': {
            'Basic Settings': CHART_SETTINGS.concat([
                {
                    label: 'Curve Type', key: 'options.curveType', inputType: 'select', selectValues: [
                        { value: 'none', label: '' },
                        { value: 'function', label: 'Smooth' }
                    ]
                }, { label: 'Marker Size', key: 'options.pointSize', inputType: 'number' }]),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': [{ label: 'Line Width', key: 'options.lineWidth', inputType: 'number' }].concat(CHART_APPEARANCE),
            'Annotation': CHART_ANNOTATION,
            'Animation': CHART_ANIMATION
        },
        'PieChart': {
            'Basic Settings': CHART_SETTINGS.concat([
                { label: '3D?', key: 'options.is3D', inputType: 'checkbox' },
                { label: 'Donut Size', key: 'options.pieHole', inputType: 'number', min: 0, max: 0.9, step: 0.1 },
                { label: 'Start Angle', key: 'options.pieStartAngle', inputType: 'number' },
                {
                    label: 'Slice Text', key: 'options.pieSliceText', inputType: 'select', selectValues: [
                        { value: 'percentage', label: 'Percentage' },
                        { value: 'value', label: 'Value' },
                        { value: 'label', label: 'Label' },
                        { value: 'none', label: 'None' }
                    ]
                }
            ]),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Appearance': CHART_APPEARANCE,
            'Animation': CHART_ANIMATION
        },
        'ScatterChart': {
            'Basic Settings': CHART_SETTINGS,
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Trend': CHART_TREND,
            'Appearance': CHART_APPEARANCE,
            'Animation': CHART_ANIMATION
        },
        'SteppedAreaChart': {
            'Basic Settings': CHART_SETTINGS.concat(CHART_STACKED),
            'Title': CHART_TITLE,
            'Legend': CHART_LEGEND,
            'Category Axis': CHART_CATEGORY_AXIS,
            'Value Axis': CHART_VALUE_AXIS,
            'Appearance': CHART_APPEARANCE,
            'Annotation': CHART_ANNOTATION,
            'Animation': CHART_ANIMATION
        }
    }
}

/*
export type GoogleChartWrapperChartType =
  | "AnnotationChart" : Annotation charts are interactive time series line charts that support annotations.
  |     "AreaChart" : Area Charts are used to represent quantitative variations
  |     "BarChart"
  |     "BubbleChart" : A bubble chart is used to visualize a data set with two to four dimensions.
  | "Calendar" : A calendar chart is a visualization used to show activity over the course of a long span of time, such as months or years.
  |     "CandlestickChart" : A candlestick pattern is a particular sequence of candlesticks, which is mainly used to identify trends.
  |     "ColumnChart"
  | "ComboChart" - Configured into Column Chart
  | "DiffChart" : A diff chart is a chart designed to highlight the differences between two charts with comparable data
  | "DonutChart"
  | "Gantt" : A Gantt chart is a type of chart that illustrates the breakdown of a project into its component tasks.
  | "Gauge"
  | "GeoChart"
  | "Histogram" : A histogram is a chart that groups numeric data into bins, displaying the bins as segmented columns.
  |     "LineChart"
  | "Line" : Line Charts are a typical pictorial representation that depicts trends and behaviors over time
  | "Bar"
  | "Map"
  | "OrgChart" : Org charts are diagrams of a hierarchy of nodes, commonly used to portray superior/subordinate relationships in an organization
  |     "PieChart"
  | "Sankey" : A sankey diagram is a visualization used to depict a flow from one set of values to another.
  |     "ScatterChart"
  |     "SteppedAreaChart"
  | "Table"
  | "Timeline" : A timeline is a chart that depicts how a set of resources are used over time.
  | "TreeMap"
  | "WaterfallChart"
  | "WordTree";
*/

/*
export interface ChartWrapperOptions {
    chartType: string;
    containerId: string;
    options: Partial<{
      width: number;
      height: number;
      is3D: boolean;
      title: string;
      backgroundColor: string;
      hAxis?: {
        minValue?: any;
        maxValue?: any;
        ticks?: GoogleChartTicks;
        title?: string;
        viewWindow?: { max?: any; min?: any };
        [otherOptionKey: string]: any;
      };
      vAxis?: {
        minValue?: any;
        maxValue?: any;
        ticks?: GoogleChartTicks;
        title?: string;
        viewWindow?: { max?: any; min?: any };
        [otherOptionKey: string]: any;
      };
      legend: any;
      colors: string[];
      [otherOptionKey: string]: any;
    }>;
    dataTable?: GoogleDataTable;
    dataSourceUrl?: string;
    query?: string;
    refreshInterval?: number;
    view: any[] | {};
    [otherOptionKey: string]: any;
  }
*/

/*
export type GoogleChartOptions = {
    width?: number;
    height?: number;
    is3D?: boolean;
    backgroundColor: string;

    title?: string;
    hAxis?: {
      minValue?: any;
      maxValue?: any;
      ticks?: GoogleChartTicks;
      title?: string;
      viewWindow?: { max?: any; min?: any; [otherOptionKey: string]: any };
      [otherOptionKey: string]: any;
    };
    vAxis?: {
      minValue?: any;
      maxValue?: any;
      ticks?: GoogleChartTicks;
      title?: string;
      viewWindow?: { max?: any; min?: any; [otherOptionKey: string]: any };
      [otherOptionKey: string]: any;
    };
    bubble?: {};
    pieHole?: number;
    redFrom?: number;
    redTo?: number;
    yellowFrom?: number;
    yellowTo?: number;
    minorTicks?: number;
    legend?:
      | string
      | {
          position?: string;
          maxLines?: number;
          [otherOptionKey: string]: any;
        };
    curveType?: string;
    showTooltip?: boolean;
    showInfoWindow?: boolean;
    allowHtml?: boolean;
    isStacked?: string | boolean;
    minColor?: string;
    midColor?: string;
    maxColor?: string;
    headerHeight?: number;
    fontColor?: string;
    showScale?: boolean;
    bar?: { groupWidth?: string }; // Remove space between bars.
    candlestick?: {
      fallingColor?: { strokeWidth?: number; fill?: string }; // red
      risingColor?: { strokeWidth?: number; fill?: string }; // green
      [otherOptionKey: string]: any;
    };
    wordtree?: {
      format?: string;
      word?: string;
      [otherOptionKey: string]: any;
    };
    [otherOptionKey: string]: any;
  };
  */