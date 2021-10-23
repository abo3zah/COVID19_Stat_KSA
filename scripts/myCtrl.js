app.controller("statistics", function ($scope, $http, $q, $timeout) {

  $scope.show = false;
  $scope.reverse = true;
  $scope.propertyName = 'Reportdt';
  $scope.color1 = '#ff8389'
  $scope.color2 = '#33b1ff'
  $scope.color3 = '#6fdc8c'

  $scope.json1 = $http.get(
    'https://services6.arcgis.com/bKYAIlQgwHslVRaK/arcgis/rest/services/Cumulative_Date_Grouped_ViewLayer/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
  )

  $scope.json2 = $http.get(
    'https://services6.arcgis.com/bKYAIlQgwHslVRaK/ArcGIS/rest/services/Vaccination_Individual_Total/FeatureServer/0/query?where=1%3D1&outFields=*&orderByFields=Reportdt+DESC&f=json',
  );

  $q.all([$scope.json1, $scope.json2]).then(function (values) {
    //define
    data = [];
    prevCases = null;
    prevDeathCases = null;
    prevRecoveredCases = null;

    values[0].data.features.forEach(x => {
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

    $scope.casesData = data;

    data = [];

    values[1].data.features.forEach(x => {
      //fix the date column
      date = new Date(x.attributes.Reportdt)
      x.attributes.Reportdt = date.toJSON().slice(0, 10);

      //put the data in the array
      data.push(x.attributes)
    });

    $scope.vaccinationData = data;
    
    //draw the linear graph
    drawChart(
      [{
          title: 'Confirmed Cases',
          data: $scope.casesData.map((e) => e.Confirmed),
          color: $scope.color1
        },
        {
          title: 'Recovered Cases',
          data: $scope.casesData.map((e) => e.Recovered),
          color: $scope.color2
        },
        {
          title: 'Deaths Cases',
          data: $scope.casesData.map((e) => e.Deaths),
          color: $scope.color3
        }
      ],
      $scope.casesData.map((e) => e.Reportdt),
      'Date',
      '# of Cases',
      'COVID-19 Accumulated',
      'canvasLinear'
    );

    //draw the Active cases graph
    drawChart(
      [{
        title: 'Active Cases',
        data: $scope.casesData.map((e) => e.activeCases),
        color: $scope.color1
      }],
      $scope.casesData.map((e) => e.Reportdt),
      'Date',
      '# of Cases',
      'COVID-19 Active Cases',
      'canvasActiveCases',
    );

    //draw the new cases graph
    drawChart(
      [{
          title: 'New Confirmed Cases',
          data: $scope.casesData.map((e) => e.newCases),
          color: $scope.color1
        },
        {
          title: 'New Recovered Cases',
          data: $scope.casesData.map((e) => e.newRecoveredCases),
          color: $scope.color2
        },
        {
          title: 'New Death Cases',
          data: $scope.casesData.map((e) => e.newDeathCases),
          color: $scope.color3
        }
      ],
      $scope.casesData.map((e) => e.Reportdt),
      'Date',
      '# of Cases',
      'COVID-19 New Cases',
      'canvasNewCases',
    );

    //draw the total vaccination graph
    drawChart(
      [{
          title: 'Total Vaccinated',
          data: $scope.vaccinationData.map((e) => e.Total_Vaccinations).reverse(),
          color: $scope.color1
        },
        {
          title: 'Total First Dose',
          data: $scope.vaccinationData.map((e) => e.FirstDose).reverse(),
          color: $scope.color2
        },
        {
          title: 'Total Second Dose',
          data: $scope.vaccinationData.map((e) => e.SecondDose).reverse(),
          color: $scope.color3
        }
      ],
      $scope.vaccinationData.map((e) => e.Reportdt).reverse(),
      'Date',
      'Total',
      'Vaccination',
      'canvasVacin',
    );

    $timeout(function(){
      $scope.show = true;
    },3000)

  })

  //sort table by
  $scope.sortBy = function (propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  }

});
