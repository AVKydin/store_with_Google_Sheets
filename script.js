gapi.load('client', initClient);

function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyDtZJ2OspEUtqkCoQvZ5nIrm256zvMYs5I',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function() {
        console.log('Google Sheets API initialized');
        getDataFromSheet();
    });
}

function getDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU',
        // range: 'Nike Lebron, Jordan',
        range: 'Adidas Yeezy 700',
    }).then(function(response) {
        let values = response.result.values;
        console.log('Data from Google Sheet:', values);
    }).catch(function(error) {
        console.error('Error fetching data:', error.result.error.message);
    });

}

