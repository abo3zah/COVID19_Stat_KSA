app.controller("statistics", function ($scope, $http) {

  $scope.reverse = true;
  $scope.propertyName = 'Reportdt';
  $scope.color1 = '#ff8389'
  $scope.color2 = '#33b1ff'
  $scope.color3 = '#6fdc8c'

  //download json
  $http.get("https://services6.arcgis.com/bKYAIlQgwHslVRaK/arcgis/rest/services/Cumulative_Date_Grouped_ViewLayer/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json")
    .then((response) => {
      //define
      data = [];
      prevCases = null;
      prevDeathCases = null;
      prevRecoveredCases = null;

      //iterate through the data
      response.data.features.forEach(x => {
        //fix the date column
        date = new Date(x.attributes.Reportdt)
        x.attributes.Reportdt = date.toJSON().slice(0,10);

        //generate new cases columns
        if (prevCases == null){
          x.attributes.newCases = 1;
        }else{
          x.attributes.newCases = x.attributes.Confirmed - prevCases;
        }

        //generate death cases columns
        if (prevDeathCases == null){
          x.attributes.newDeathCases = 0;
        }else{
          x.attributes.newDeathCases = x.attributes.Deaths - prevDeathCases;
        }

        //generate recovered cases columns
        if (prevRecoveredCases == null){
          x.attributes.newRecoveredCases = 0;
        }else{
          x.attributes.newRecoveredCases = x.attributes.Recovered - prevRecoveredCases;
        }

        //generate the active cases graph
        x.attributes.activeCases = x.attributes.Confirmed - x.attributes.Recovered - x.attributes.Deaths

        //put the data in the array
        data.push(x.attributes)

        //assign confirmed cases to be used in generating the new cases
        prevCases = x.attributes.Confirmed;
        prevDeathCases = x.attributes.Deaths;
        prevRecoveredCases = x.attributes.Recovered;
      });

      //assign the data to generate the table
      $scope.data = data;

      //draw the linear graph
      $scope.drawChartLinear(data);

      //draw the log graph
      $scope.drawChartLog(data);

      //draw the Active cases graph
      $scope.drawChartActiveCases(data);

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
        backgroundColor: $scope.color1,
        borderColor: $scope.color1,
      },
      {
        label: 'Recovered Cases',
        data: data.map((e) => e.Recovered),
        backgroundColor: $scope.color2,
        borderColor: $scope.color2,
      },
      {
        label: 'Deaths Cases',
        data: data.map((e) => e.Deaths),
        backgroundColor: $scope.color3,
        borderColor: $scope.color3,
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
        backgroundColor: $scope.color1,
        borderColor: $scope.color1,
      },
      {
        label: 'Recovered Cases',
        data: data.map((e) => e.Recovered),
        backgroundColor: $scope.color2,
        borderColor: $scope.color2,
      },
      {
        label: 'Deaths Cases',
        data: data.map((e) => e.Deaths),
        backgroundColor: $scope.color3,
        borderColor: $scope.color3,
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

  //draw the Active cases graph
  $scope.drawChartActiveCases = function (data) {

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
        label: 'Active Cases',
        data: data.map((e) => e.activeCases),
        backgroundColor: $scope.color1,
        borderColor: $scope.color1,
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
          text: 'COVID-19 Active Cases Graph',
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

    var chart1 = new Chart(document.getElementById('canvasActiveCases'), config1);
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
        backgroundColor: $scope.color1,
        borderColor: $scope.color1,
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

  //sort table by
  $scope.sortBy = function(propertyName){
    $scope.reverse = ($scope.propertyName === propertyName)? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  }
});
