
const spreadsheetId = '1HJzKapn438dVT3vws2Ea7zG9FMmoKv8yE3GbQYvS6GU';
const range = 'Nike Lebron, Jordan';
const rangeTwo = 'Adidas Yeezy 700';
const apiKey = 'AIzaSyDtZJ2OspEUtqkCoQvZ5nIrm256zvMYs5I';

gapi.load('client', function() {
    initClient();
});

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(() => {
        console.log('Google Sheets API initialized');
        getDataFromSheet();
    }, (error) => {
        console.error('Error initializing Google Sheets API:', error);
    });
}

function getDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    }).then((response) => {
        const values = response.result.values;
        console.log('Data from Google Sheet:', values);
        displayData(values);
    }).catch((error) => {
        console.error('Error fetching data:', error.result.error.message);
    });
}

function displayData(data) {
    const list = document.getElementById('data-list');
    list.innerHTML = '';

    data.forEach((row) => {
        const listItem = document.createElement('li');
        listItem.textContent = row.join(', ');
        list.appendChild(listItem);
    });
}
