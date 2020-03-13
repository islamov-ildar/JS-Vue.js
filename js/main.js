const products = [
    {id: 1, title: "Notebook", price: 20000},
    {id: 2, title: "Mouse", price: 1500},
    {id: 3, title: "Keyboard", price: 5000},
    {id: 4, title: "Gamepad", price: 4500},
];

const renderProduct = (title, price, img = "images/ico.png") => {
    return `<div class="product-item">
            <div class="product-description">
            <h3>${title}</h3>
            <p><h3>${price}</h3></p>
            <button class="buy-btn">Добавить в корзину</button>
            </div>
            <div class="product-img"><img src= ${img} alt="product-photo"></div>    
            </div>
            `;
};

const renderProducts = list => {
    const productList = list.map(item => renderProduct(item.title, item.price));
    document.querySelector('.products').innerHTML = productList.join("");
};

renderProducts(products);

//Попытка упростить запись функции не увенчалась успехом.