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
        x.attributes.Reportdt = date.toJSON().slice(0, 10);

        //generate new cases columns
        if (prevCases == null) {
          x.attributes.newCases = 1;
        } else {
          x.attributes.newCases = x.attributes.Confirmed - prevCases;
        }

        //generate death cases columns
        if (prevDeathCases == null) {
          x.attributes.newDeathCases = 0;
        } else {
          x.attributes.newDeathCases = x.attributes.Deaths - prevDeathCases;
        }

        //generate recovered cases columns
        if (prevRecoveredCases == null) {
          x.attributes.newRecoveredCases = 0;
        } else {
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
      $scope.drawChart(
        [
          {
            title:'Confirmed Cases',
            data: data.map((e) => e.Confirmed),
            color: $scope.color1
          },
          {
            title:'Recovered Cases',
            data: data.map((e) => e.Recovered),
            color: $scope.color2
          },
          {
            title:'Deaths Cases',
            data: data.map((e) => e.Deaths),
            color: $scope.color3
          }
        ],
        data.map((e) => e.Reportdt),
        'Date',
        '# of Cases',
        'COVID-19 Accumulated Graph',
        'canvasLinear'
      );

      //draw the log graph
      $scope.drawChart(
        [
          {
            title:'Confirmed Cases',
            data: data.map((e) => e.Confirmed),
            color: $scope.color1
          },
          {
            title:'Recovered Cases',
            data: data.map((e) => e.Recovered),
            color: $scope.color2
          },
          {
            title:'Deaths Cases',
            data: data.map((e) => e.Deaths),
            color: $scope.color3
          }
        ],
        data.map((e) => e.Reportdt),
        'Date',
        '# of Cases',
        'COVID-19 Accumulated Graph',
        'canvasLog',
        'logarithmic'
      );

      //draw the Active cases graph
      $scope.drawChart(
        [
          {
            title:'Active Cases',
            data: data.map((e) => e.activeCases),
            color: $scope.color1
          }
        ],
        data.map((e) => e.Reportdt),
        'Date',
        '# of Cases',
        'COVID-19 Active Cases Graph',
        'canvasActiveCases',
      );

      //draw the new cases graph
      $scope.drawChart(
        [
          {
            title:'New Confirmed Cases',
            data: data.map((e) => e.newCases),
            color: $scope.color1
          },
          {
            title:'New Recovered Cases',
            data: data.map((e) => e.newRecoveredCases),
            color: $scope.color2
          },
          {
            title:'New Death Cases',
            data: data.map((e) => e.newDeathCases),
            color: $scope.color3
          }
        ],
        data.map((e) => e.Reportdt),
        'Date',
        '# of Cases',
        'COVID-19 New Cases Graph',
        'canvasNewCases',
      );
    });

  $scope.drawChart = function (yAxisData, xAxisData, xAxisName, yAxisName, graphTitle, canvasId, graphType = 'linear') {

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

    for (obj of yAxisData){
      datasets.push({
        label: obj.title,
        data: obj.data,
        backgroundColor: obj.color,
        borderColor: obj.color,
      })
    }

    var options = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: {
          display: yAxisData.length==1?false:true,
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

    var chart1 = new Chart(document.getElementById(canvasId), config1);
  }

  //sort table by
  $scope.sortBy = function (propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  }
});
