let preloader = document.getElementById('preloader');
let intervalLoader = setInterval(preloaderFu, 2000);

function preloaderFu() {
    preloader.classList.add('preloader-hidden');
}

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
        preloader.classList.toggle('preloader-hidden');

    }, (error) => {
        console.error('Error initializing Google Sheets API:', error);
    });
}


async function getDataFromSheet() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const values = response.result.values;
        displayData(values);
        showCart();
    } catch (error) {
        console.error('Помилка отримання даних:', error.result.error.message);
        throw error;
    }
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

    return data.slice(1).map((row) => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });
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

function showMessage(message, success = true) {
    const messageBox = document.querySelector('.message-box');
    messageBox.innerHTML = message;
    messageBox.classList.toggle('success', success);
    messageBox.style.display = 'block';

    // Зникає після 3 секунд (можна змінити за потребою)
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}
async function performPayment() {
    try {
        // ... (код для обробки оплати)
        showMessage('Оплата успішна', true);
    } catch (error) {
        showMessage('Помилка при обробці оплати', false);
    }
}

document.onclick = async function (e) {
    if (e.target.attributes.name !== undefined) {
        preloader.classList.remove('preloader-hidden');
        try {
            if (e.target.attributes.name.nodeValue === 'add-to-cart') {
                addToCart(e.target.attributes.data.nodeValue);
                showMessage('Товар додано до кошика!');
            } else if (e.target.attributes.name.nodeValue === 'delete-goods') {
                delete cart[e.target.attributes.data.nodeValue];
                showCart();
                localStorage.setItem('cart', JSON.stringify(cart));
                showMessage('Товар видалено з кошика!');
            } else if (e.target.attributes.name.nodeValue === 'plus-goods') {
                cart[e.target.attributes.data.nodeValue]++;
                showCart();
                localStorage.setItem('cart', JSON.stringify(cart));
                showMessage('Кількість товару збільшено!');
            } else if (e.target.attributes.name.nodeValue === 'fruits') {
                range = "Фрукти";
                await getDataFromSheet();
                showMessage('Відображено фрукти!');
            } else if (e.target.attributes.name.nodeValue === 'vegetables') {
                range = "Овочі";
                await getDataFromSheet();
                showMessage('Відображено овочі!');
            } else if (e.target.attributes.name.nodeValue === 'minus-goods') {
                if (cart[e.target.attributes.data.nodeValue] - 1 === 0) {
                    delete cart[e.target.attributes.data.nodeValue];
                } else {
                    cart[e.target.attributes.data.nodeValue]--;
                }
                showCart();
                localStorage.setItem('cart', JSON.stringify(cart));
                showMessage('Кількість товару зменшено!');
            } else if (e.target.attributes.name.nodeValue === 'showCart') {
                const cartBlock = document.querySelector('.cartBlock');
                if (cartBlock.style.display === "flex") {
                    cartBlock.style.display = "none";
                } else {
                    cartBlock.style.display = "flex";
                }
                showMessage('Відображено кошик!');
            }
        } catch (error) {
            console.error('Помилка обробки даних:', error);
        } finally {
            preloader.classList.add('preloader-hidden');
        }
    }
    return false;
}

buttonCart.onclick = async function () {
    preloader.classList.remove('preloader-hidden');
    try {
        // Ваша логіка сплати або відправлення даних на сервер
        await performPayment();
        showMessage('Оплата успішно здійснена!');
        // Очистити кошик та оновити відображення
        cart = {};
        showCart();
        localStorage.removeItem('cart');
    } catch (error) {
        console.error('Помилка при сплаті:', error);
        showMessage('Помилка при сплаті, спробуйте ще раз.');
    } finally {
        preloader.classList.add('preloader-hidden');
    }
};

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
        buttonCart.setAttribute('disabled', 'true');
    } else {
        buttonCart.removeAttribute('disabled');
    }
    buttonCart.classList.add('btn', 'btn-success');
    buttonCart.innerHTML = "Сплатити";
    div.appendChild(buttonCart)
}

document.addEventListener("DOMContentLoaded", function () {
    window.onscroll = function () {
        scrollFunction();
    };
});

function scrollFunction() {
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE, Opera
}
























