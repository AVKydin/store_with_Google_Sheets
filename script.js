
const spreadsheetId = '1c6wl8ebc0RC42ItUyW6829hinHZxlKI1qMOfT2tMLXs';
const range = 'Fruits';
const rangeTwo = 'Adidas Yeezy 700';
const apiKey = 'AIzaSyDtZJ2OspEUtqkCoQvZ5nIrm256zvMYs5I';

const list = document.querySelector('.shop-field');
const title = document.querySelector('h1');
const cart = {};
let restOfData;
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
        // console.log('Data from Google Sheet:', values);

        displayData(values);
    }).catch((error) => {
        console.error('Error fetching data:', error.result.error.message);
    });
}


title.innerHTML = range;
function displayData(data) {
    list.innerHTML = '';
    restOfData = dataHelper(data);

    restOfData.forEach((row) => {
        card(row);
    });
}

function dataHelper(data){
    const keys = data[0];

    const arrayOfObjects = data.slice(1).map((row) => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });
    return arrayOfObjects;
}

function card(row){
    // console.log(row)
    const card = document.createElement('div');
    const titleCard = document.createElement('h5');
    const image = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');
    card.classList.add('col-lg-2', 'col-md-2', 'col-sm-3', 'text-center', 'card');
    titleCard.innerHTML = row.name;
    image.src = row.image;
    image.alt = row.name;
    image.style.width = '100px';
    p.innerHTML = row.cost + ' грн/' + row.kg;
    button.classList.add('btn', 'btn-success');
    button.innerHTML = "Купити";
    button.setAttribute('data', row.id);
    button.setAttribute('name', 'add-to-cart');
    card.append(titleCard, image, p, button)
    list.appendChild(card);
}

document.onclick = function (e){
    if(e.target.attributes.name.nodeValue === 'add-to-cart'){
        addToCart(e.target.attributes.data.nodeValue);
    }
}

function addToCart(elem){
    if(cart[elem] !==undefined){
        cart[elem] ++
    } else {
        cart[elem] = 1;
    }
    showCart()
}

function showCart(){
    let ul = document.querySelector('.cart')
    ul.innerHTML = '';
    let sum = 0;
    for (const key in cart) {
        console.log(cart)

        let li = '<li>';
        li += restOfData[key-1]['name'] + ' - ';
        li += cart[key] + restOfData[key-1]['kg'] + ' на суму - ';
        li += restOfData[key-1]['cost'] * cart[key] + ' грн.';
        sum += restOfData[key-1]['cost'] * cart[key];

        ul.innerHTML += li;
    }

    ul.innerHTML += 'Всього: ' + sum + ' грн.'

}



























