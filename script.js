let preloader = document.getElementById('preloader');

function preloaderFu() {
    setInterval(function() {
        preloader.classList.add('preloader-hidden');
    }, 1200);
}
preloaderFu();
const spreadsheetId = '1c6wl8ebc0RC42ItUyW6829hinHZxlKI1qMOfT2tMLXs';
let range = 'Фрукти';
const apiKey = 'AIzaSyDtZJ2OspEUtqkCoQvZ5nIrm256zvMYs5I';

const list = document.querySelector('.shop-field');
const title = document.querySelector('h1');
const buttonCart = document.createElement('button');
let cart = {};
let restOfData;

function loadCartLocalStorage(){
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}

loadCartLocalStorage();

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
        showCart();
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
    // console.log(e.target.innerHTML)
    if(e.target.attributes.name !== undefined) {
        if(e.target.attributes.name.nodeValue === 'add-to-cart'){
            addToCart(e.target.attributes.data.nodeValue);
        } else if(e.target.attributes.name.nodeValue === 'delete-goods'){
            delete cart[e.target.attributes.data.nodeValue];
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        } else if(e.target.attributes.name.nodeValue === 'plus-goods'){
            cart[e.target.attributes.data.nodeValue]++;
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        } else if(e.target.attributes.name.nodeValue === 'fruits'){
            range = "Фрукти";
            initClient();
        }  else if(e.target.attributes.name.nodeValue === 'vegetables'){
            range = "Овочі";
            initClient();
        } else if(e.target.attributes.name.nodeValue === 'minus-goods'){
            if(cart[e.target.attributes.data.nodeValue] - 1 ===0){
                delete cart[e.target.attributes.data.nodeValue];
            } else {
                cart[e.target.attributes.data.nodeValue]--;
            }
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        } else if(e.target.attributes.name.nodeValue === 'showCart'){
            // console.log(e.target);
            const cartBlock = document.querySelector('.cartBlock');
            if(cartBlock.style.display === "flex"){
                cartBlock.style.display = "none"
            } else {
                cartBlock.style.display = "flex"
            }
        }
    }
    return false;
}


function addToCart(elem){
    if(cart[elem] !==undefined){
        cart[elem] ++
    } else {
        cart[elem] = 1;
    }
    showCart();
    localStorage.setItem('cart', JSON.stringify(cart))
}

function showCart(){
    let ol = document.querySelector('.cart');
    ol.classList.add('list-group', 'list-group-flush', 'ol')
    ol.innerHTML = '';
    let sum = 0;
    for (const key in cart) {
        let li = '<li class="list-group-item li">';
        li += restOfData[key-1]['name'] + ' - ';
        li += cart[key] + restOfData[key-1]['kg'] + ' на суму - ';
        li += restOfData[key-1]['cost'] * cart[key] + ' грн.';
        li += '<div>';
        li += ` <button class="btn btn-outline-success" name="plus-goods" data="${key}">+</button> `;
        li += ` <button class="btn btn-outline-warning" name="minus-goods" data="${key}">-</button> `;
        li += ` <button class="btn btn-outline-danger" name="delete-goods" data="${key}">X</button>`;
        li += '</div>';
        li += '</li>';
        sum += restOfData[key-1]['cost'] * cart[key];
        ol.innerHTML += li;
    }

    ol.innerHTML += 'Всього: ' + sum + ' грн.'
    const div = document.querySelector('.cartBlock');
    if(Object.keys(cart).length === 0){
        buttonCart.setAttribute('disabled', true);
    } else {
        buttonCart.removeAttribute('disabled');
    }
    buttonCart.classList.add('btn', 'btn-success');
    buttonCart.innerHTML = "Сплатити";
    div.appendChild(buttonCart)
}


























