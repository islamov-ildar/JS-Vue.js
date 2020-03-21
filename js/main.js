const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


let getRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status !== 200) {
                    reject('Error');
                } else {
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.send();
    });
};

getRequest (`${API}/catalogData.json`).then(
    data => {console.log(data)},
    error => {console.log(error)}
);

class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts();
        this._render();
        //this.totalSumCalc();
    }

    _fetchProducts() {
        this.goods = [
            {id: 1, title: 'Notebook', price: 20000},
            {id: 2, title: 'Mouse', price: 1500},
            {id: 3, title: 'Keyboard', price: 5000},
            {id: 4, title: 'Gamepad', price: 4500},
        ];
    }

    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }

    //Определяем суммарную стоимость товаров на странице

    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
}

class ProductItem {
    constructor(product, img='images/ico.png') {
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id}">
            <div class="product-description">
            <h3>${this.title}</h3>
            <p><h3>${this.price}</h3></p>
            <button class="buy-btn">Добавить в корзину</button>
            </div>
            <div class="product-img"><img src= ${this.img} alt="product-photo"></div>    
            </div>
            `;
    }
}

let myProductList = new ProductList();


// Пустые классы для корзины и товара в корзине

class Cart extends ProductList {
    constructor (cartContainer = ".cartContainer", goods, allProductList){
        super(goods, allProductList);
        this.cartContainer = cartContainer;
        this.render();
    }

    render(){
        return super._render() //здесь должен быть переобозначен productObject = new ProductInCart; каким образом - непонятно


    }

}

class ProductInCart extends ProductItem {
    constructor (product, img) {
        super(product.title, product.id, product.price, img);
    }

    render(){
        return super.render();
    }
}

//Считаем что на класс .buy-btn навешан обработчик событий который добавляет товар в массив myCart.goods

//let myCart = new Cart();

//Пункты 1 и 2 дз