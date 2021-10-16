fetch('https://services6.arcgis.com/bKYAIlQgwHslVRaK/arcgis/rest/services/Cumulative_Date_Grouped_ViewLayer/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json')
  .then(response => response.json())
  .then(data => handleData(data));

function handleData(data){
    data['features'].forEach((data,i) => {
        console.log(data['attributes']);
    });

}