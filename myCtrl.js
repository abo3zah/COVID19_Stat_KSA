app.controller("statistics", function ($scope, $http) {

  //download json
  $http.get("https://services6.arcgis.com/bKYAIlQgwHslVRaK/arcgis/rest/services/Cumulative_Date_Grouped_ViewLayer/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json")
    .then((response) => {
      //define
      data = [];
      oldCases = null;

      //iterate through the data
      response.data.features.forEach(x => {
        //fix the date column
        x.attributes.Reportdt = new Date(x.attributes.Reportdt).toDateString();

        //generate new cases columns
        if (oldCases == null){
          x.attributes.newCases = 1;
        }else{
          x.attributes.newCases = x.attributes.Confirmed - oldCases;
        }

        //generate the active cases graph
        x.attributes.activeCases = x.attributes.Confirmed - x.attributes.Recovered - x.attributes.Deaths

        //put the data in the array
        data.push(x.attributes)

        //assign confirmed cases to be used in generating the new cases
        oldCases = x.attributes.Confirmed;
      });

      //assign the data to generate the table
      $scope.data = data;

      //draw the linear graph
      $scope.drawChartLinear(data);

      //draw the log graph
      $scope.drawChartLog(data);

      //draw the new cases graph
      $scope.drawChartNewCases(data);
    });

  $scope.drawChartLinear = function (data) {

    var scales = {
      x:{
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      },
      y: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: '# of Cases',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      }
    };

    var datasets = [{
        label: 'Confirmed Cases',
        data: data.map((e) => e.Confirmed),
        backgroundColor: 'rgba(0, 119, 204, 0.5)',
        borderColor: 'rgba(0, 119, 204, 1)',
      },
      {
        label: 'Recovered Cases',
        data: data.map((e) => e.Recovered),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Deaths Cases',
        data: data.map((e) => e.Deaths),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
      }
    ]

    var options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'COVID-19 Accumulated Graph',
          font: {
            family: 'Comic Sans MS',
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
        labels: data.map((e) => e.Reportdt),
        datasets: datasets
      },
      options: options
    };

    var chart1 = new Chart(document.getElementById('canvasLinear'), config1);
  }

  $scope.drawChartLog = function (data) {

    var scales = {
      x:{
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      },
      y: {
        type: 'logarithmic',
        display: true,
        title: {
          display: true,
          text: '# of Cases',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      }
    };

    var datasets = [{
        label: 'Confirmed Cases',
        data: data.map((e) => e.Confirmed),
        backgroundColor: 'rgba(0, 119, 204, 0.5)',
        borderColor: 'rgba(0, 119, 204, 1)',
      },
      {
        label: 'Recovered Cases',
        data: data.map((e) => e.Recovered),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Deaths Cases',
        data: data.map((e) => e.Deaths),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
      }
    ]

    var options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'COVID-19 Logarithmic Graph',
          font: {
            family: 'Comic Sans MS',
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
        labels: data.map((e) => e.Reportdt),
        datasets: datasets
      },
      options: options
    };

    var chart1 = new Chart(document.getElementById('canvasLog'), config1);
  }

  //draw the new cases graph
  $scope.drawChartNewCases = function (data) {

    var scales = {
      x:{
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      },
      y: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: '# of Cases',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        }
      }
    };

    var datasets = [{
        label: 'New Cases',
        data: data.map((e) => e.newCases),
        backgroundColor: 'rgba(0, 119, 204, 0.5)',
        borderColor: 'rgba(0, 119, 204, 1)',
      }
    ]

    var options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'COVID-19 New Cases Graph',
          font: {
            family: 'Comic Sans MS',
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
        labels: data.map((e) => e.Reportdt),
        datasets: datasets
      },
      options: options
    };

    var chart1 = new Chart(document.getElementById('canvasNewCases'), config1);
  }
});
