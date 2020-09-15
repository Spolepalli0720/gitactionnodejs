module.exports.DASHBOARD_ITEMS = [
    {
        accordion: 'Chart Items',
        provider: 'google-charts',
        group: 'comparison',
        label: 'Comparison',
        icon: 'fa fa-bar-chart',
        variations: [
            { value: 'AreaChart', label: 'Area Chart' },
            { value: 'BarChart', label: 'Bar Chart' },
            { value: 'ColumnChart', label: 'Column Chart' },
            { value: 'LineChart', label: 'Line Chart' },
            { value: 'PieChart', label: 'Pie Chart' },
            { value: 'ScatterChart', label: 'ScatterChart' },
            { value: 'SteppedAreaChart', label: 'Stepped Area Chart' },
        ]
    },
    {
        accordion: 'Chart Items',
        provider: 'google-charts',
        group: 'proportion',
        label: 'Proportion',
        icon: 'fas fa-pie-chart',
        variations: [
            { value: 'PieChart', label: 'Pie Chart' }
        ]
    },
    {
        accordion: 'Chart Items',
        provider: 'google-charts',
        group: 'trend',
        label: 'Trend',
        icon: 'fa fa-line-chart',
        variations: [
            { value: 'CandlestickChart', label: 'Candlestick Chart' },
            { value: 'LineChart', label: 'Line Chart' },
            { value: 'ScatterChart', label: 'Scatter Chart' },
        ]
    },
    {
        accordion: 'Chart Items',
        provider: 'google-charts',
        group: 'difference',
        label: 'Difference',
        icon: 'fas fa-not-equal',
        variations: [
            { value: 'BarChart', label: 'Bar Chart' },
            { value: 'ColumnChart', label: 'Column Chart' },
            { value: 'PieChart', label: 'Pie Chart' },
            { value: 'ScatterChart', label: 'Scatter Chart' },
        ]
    },
    {
        accordion: 'Chart Items',
        provider: 'google-charts',
        group: 'dimension',
        label: 'Dimension',
        icon: 'fa fa-spinner',
        variations: [
            { value: 'BubbleChart', label: 'Bubble Chart' },
        ]
    },
    {
        accordion: 'Chart Items',
        provider: 'word-cloud',
        group: 'WordCloud',
        label: 'WordCloud',
        icon: 'fa fa-file-word-o',
        variations: [
            { value: 'WordCloud', label: 'Word Cloud' },
        ]
    },
    {
        accordion: 'Data Items',
        provider: 'studio-dashboard',
        group: 'data-table',
        label: 'Data Table',
        icon: 'fa fa-table'
    },
    {
        accordion: 'Social Metrics',
        provider: 'google-charts',
        group: 'explainability-chart',
        label: 'Explainability Chart',
        icon: 'fa fa-address-card',
        variations: [
            { value: 'BubbleChart', label: 'Bubble Chart' },
        ]
    }
]
