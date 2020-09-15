export default {
    height: 200,
    type: 'radialBar',
    options: {
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                }
            },
        },
        colors: ['#4680ff'],
        labels: ['Active variants'],
    },
    series: [70]
}