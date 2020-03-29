const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        imgCatalog: 'images/ico.png',
        searchLine: '',
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(product){
            console.log(product.id_product);
        },
        filterGoods() {
            console.log(this.searchLine);
            const regexp = new RegExp(this.searchLine, 'i');
            this.filtered = this.products.filter(product => regexp.test(product.product_name));
            console.log(this.filtered);
            this.products.forEach(el => {
                const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
                if(!this.filtered.includes(el)){
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible');
                }
            })

        }
    },
    mounted(){
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                }
            });
    }
});


/*
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

//Задание 1
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

//Задание 2
class List {
    constructor(url, container, list = listContext) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }

    getJson(url){
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
               // console.log(error);
            })
    }

    handleData(data){
        this.goods = [...data];
        this.render();
    }

    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
           // console.log(this.constructor.name);
            const productObject = new this.list[this.constructor.name](product);
           // console.log(productObject);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }

    _init(){
        return false
    }
    filter(value){
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
        console.log(this.filtered);
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
            if(!this.filtered.includes(el)){
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }

}

class Item {
    constructor(el, img='images/ico.png') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id_product}">
            <div class="product-description">
            <h3>${this.product_name}</h3>
            <p><h3>${this.price}</h3></p>
            <button class="buy-btn" 
            data-id="${this.id_product}"
            data-name="${this.product_name}"
            data-price="${this.price}">Добавить в корзину</button>
            </div>
            <div class="product-img"><img src= ${this.img} alt="product-photo"></div>    
            </div>`;
    }

}

class ProductList extends List{
    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(url, container);
        this.cart = cart;
        this.getJson().then(data => this.handleData(data));
    }
    _init(){
        document.querySelector(this.container).addEventListener('click', e => {
            if(e.target.classList.contains('buy-btn')){
                this.cart.addProduct(e.target);
            }
        });
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.search-field').value)
        })
    }
}

class ProductItem extends Item{}

class Cart extends List{
    constructor(container = ".cart-block", url = "/getBasket.json"){
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);
            });
    }

    addProduct(element){
        this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    console.log(find);
                    if(find){
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    removeProduct(element){
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if(data.result === 1){
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if(find.quantity > 1){
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _updateCart(product){
        console.log(product);
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        console.log(block);
        block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity*product.price} RUR`;

    }

    _init(){
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if(e.target.classList.contains('del-btn')){
                this.removeProduct(e.target);
            }
        });
    }
}

class CartItem extends Item{
    constructor(el, img='images/ico.png') {
        super(el, img);
        this.quantity = el.quantity;
    }
    render(){
        return `<div class="cart-item" data-id="${this.id_product}">
            <div class="product-description">
            <h3>${this.product_name}</h3>
            <p><h3>${this.price} за ед.</h3></p>
            <p><h3 class="product-quantity">Количество: ${this.quantity}</h3></p>         
            <p><h3 class="product-price">${this.price*this.quantity} RUR.</h3></p>
            <button class="del-btn" data-id = "${this.id_product}">x</button>
            </div>
            <div class="product-img"><img src= ${this.img} alt="product-photo"></div>    
            </div>`;
    }
}

const listContext = {
  ProductList: ProductItem,
  Cart: CartItem
};

let cart = new Cart;
let products = new ProductList(cart);
*/


/*
class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts();

    }

    _fetchProducts() {
        getRequest (`${API}/catalogData.json`).then(
            data => {
                console.log(data);
                this.goods = JSON.parse(data);
                this._render();
            },
            error => {console.log(error)}
        );

    }

    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }

    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
}

class ProductItem {
    constructor(product, img='images/ico.png') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
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
*/


// Пустые классы для корзины и товара в корзине

/*class Cart extends ProductList {
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
}*/

//Считаем что на класс .buy-btn навешан обработчик событий который добавляет товар в массив myCart.goods

//let myCart = new Cart();

//Пункты 1 и 2 дз