function drawChart(yAxisData, xAxisData, xAxisName, yAxisName, graphTitle, canvasId, graphType = 'linear') {

    var scales = {
        x: {
            title: {
                display: true,
                text: xAxisName,
                font: {
                    family: 'Helvetica',
                    size: 20,
                    lineHeight: 1.2,
                },
            }
        },
        y: {
            type: graphType,
            display: true,
            title: {
                display: true,
                text: yAxisName,
                font: {
                    family: 'Helvetica',
                    size: 20,
                    lineHeight: 1.2,
                },
            }
        }
    };

    var datasets = [];

    for (obj of yAxisData) {
        datasets.push({
            label: obj.title,
            data: obj.data,
            backgroundColor: obj.color,
            borderColor: obj.color,
        })
    }

    var options = {
        layout: {
            right: 20
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            legend: {
                display: yAxisData.length == 1 ? false : true,
                position: 'right',
            },
            title: {
                display: true,
                text: graphTitle,
                font: {
                    family: 'Helvetica',
                    size: 24,
                    weight: 'bold',
                    lineHeight: 1.2,
                },
            }
        },
        scales: scales
    }

    var config1 = {
        type: 'line',
        data: {
            labels: xAxisData,
            datasets: datasets
        },
        options: options
    };

    new Chart(document.getElementById(canvasId), config1);
}