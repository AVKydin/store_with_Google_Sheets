
const spreadsheetId = '1c6wl8ebc0RC42ItUyW6829hinHZxlKI1qMOfT2tMLXs';
const range = 'Fruits';
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
    const restOfData = data.slice(1);

    restOfData.forEach((row) => {
            const listItem = document.createElement('li');
            const image = document.createElement('img');
            listItem.textContent = row.join(', ');
            image.src = row[4]
            image.alt = row[3]
            image.style.width = '100px'
            list.appendChild(listItem);
            list.appendChild(image);
    });
}
