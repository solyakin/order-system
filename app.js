const foodMenu  = document.getElementById('food-menu');
const carts = document.querySelector('.cart');
const TOTAL = document.querySelector('.cart-total');
const close = document.querySelector('.close-btn');
const CART_CONTAINER = document.querySelector('.cart-container');
const cartCount = document.querySelector('#count');
const cartIcon = document.querySelector('.cart-icon');
const cartContent = document.querySelector('.cart-item');
const removeItems = document.querySelector('.remove-item')
let cart = []

fetch('./products.json').then(response => {
    return (response.json())
}).then(data => {
    const allProducts  = data.Products;
    allProducts.map(({id, name, imageUrl, price, value}) => {
        
        let markUp = `<div class="row-4">
                        <div class="img-container">
                            <img src=${imageUrl} alt=${name}>
                        </div>
                        <button class="shop-btn" data-id =${id}>
                            Add to cart
                        </button>
                        <div class="product-detail">
                            <h4>${name}</h4>
                            <p>${price}</p>
                        </div>
                        

                        <a href="#" class="barcode-text" data-id=${value}>Generate Barcode</a>

                        <svg class="barcode" jsbarcode-value=${value}></svg>
                    </div>`
        foodMenu.insertAdjacentHTML('beforeend', markUp)
        // JsBarcode('.barcode').init()  

    })

    //storing all product to local storage
    const storage = localStorage.setItem('products', JSON.stringify(allProducts))
    const shopBtns = [...document.querySelectorAll('.shop-btn')];
    shopBtns.forEach(shopBtn => {
        let id = shopBtn.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if(inCart){
            shopBtn.disabled = true;
            shopBtn.style.backgroundColor = "white";
            shopBtn.style.border = '1px solid #ff523b';
        } 
        else{
            shopBtn.addEventListener('click', (e) => {
                e.target.disabled = true;
                e.target.innerHTML = "in cart";
                //getting target product from products list
                let obj = JSON.parse(localStorage.getItem('products'))
                let product = obj.find(product => product.id === id);
                let cartItem = {...product, amount : 1}
                cart = [...cart, cartItem]
                console.log(cart)
                //save the cart item to local storage to persist data
                const cartStorage = localStorage.setItem('cart', JSON.stringify(cart))

                //displaying the cart items
                addCart(cartItem);

                //cart Total
                this.setCartValues(cart);
                CART_CONTAINER.style.visibility = "visible";

                //remove item
                console.log(document.querySelector('.cart-item'))

                document.querySelector('.cart-item').addEventListener('click', event => {
                    if(event.target.classList.contains('remove-item')){
                        let removeItem = event.target;
                        console.log(removeItem);
                        let id = removeItem.dataset.id;
                        cart = cart.filter(item => item.id !== id)
                        this.setCartValues(cart);
                        document.querySelector('.cart-item').removeChild(removeItem.parentElement.parentElement);
                        console.log(removeItem.parentElement)
                        const buttons = [...document.querySelectorAll('.shop-btn')];
                        buttons.forEach(button => {
                        if (parseInt(button.dataset.id) === id) {
                            button.disabled = false;
                            button.innerHTML = `add to bag`;
                        }
                        });
                    }
                }) 
            })
        }
    })


    const barcodeBtns = [...document.querySelectorAll('.barcode-text')];
    barcodeBtns.forEach(barcodeBtn => {
        let value = barcodeBtn.dataset.id;
        barcodeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            let obj = JSON.parse(localStorage.getItem('products'))

            let product = obj.find(product => product.value === value);
            if(product){
                console.log(product)
                JsBarcode('.barcode').init(product.value) 
            } 
        })
    })
    
})

function addCart(item){
    const markUp = `<div class="cart-item">
                        <div class="item-details">
                            <img src=${item.imageUrl} alt=${item.name}>
                            <div class="item-details-text">
                                <h4>${item.name}</h4>
                                <h5>${item.price}</h5>
                                <p class="remove-item" data-id=${item.id}>Remove</p>
                            </div>
                        </div>
                        <div class=item-amount>
                            <i class="fa fa-angle-up" aria-hidden="true"></i>
                            <p class="item-count">1<p/>
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                        </div>
                    </div>`

    carts.insertAdjacentHTML('beforeend', markUp);
}

function setCartValues(cart){
    let itemsTotal = 0;
    let cartNumber = 0;
    let SingleItemCount = 1;
    cart.map(item => {
       itemsTotal += item.price * item.amount 
       cartNumber += item.amount
    })
    console.log(itemsTotal)
    TOTAL.innerHTML = parseFloat(itemsTotal.toFixed(2));
    cartCount.innerHTML = cartNumber;


    // document.querySelector('.fa-angle-up').addEventListener('click', () => {
    //     document.querySelector('.item-count').innerHTML = SingleItemCount += 1;
    //     TOTAL.innerHTML = itemsTotal * SingleItemCount
    // })
    // document.querySelector('.fa-angle-down').addEventListener('click', () => {
    //     // if(itemCount > 1){
    //         document.querySelector('.item-count').innerHTML = SingleItemCount -= 1;
    //         TOTAL.innerHTML = itemsTotal - (item.price)
    //     // } 
    // })
}

// function removeItem(item){
//     let cartItem = cart.map(item => {
//         item.id
//     })
//     console.log(cartItem)
// }
close.addEventListener('click', ()=> {
    CART_CONTAINER.style.visibility = 'hidden';
})

cartIcon.addEventListener('click', ()=> {
    CART_CONTAINER.style.visibility = 'visible';
})
Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#interactive'),
      constraints: {
        facingMode: 'environment',
      },
    },
    locator: {
      patchSize: 'medium',
      halfSample: true,
    },
    numOfWorkers: 2,
    decoder: {
      readers: ['code_128_reader'],
    },
    locate: true,
  }, (err) => {
    if (err) {
      return
    }
    Quagga.stop()
    })
Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
    }
});
Quagga.onDetected(result => {
    console.log(result.codeResult);
    var isbn = result.codeResult.code;
        if (isbn.match(23141614)){
            var style = window.innerHeight > window.innerWidth ? 'width: ' + window.innerWidth + 'px;' : 'height: ' + window.innerHeight + 'px;';
            document.querySelector('#interactive').innerHTML = '<img src="https://i.ibb.co/7CQVJNm/blue-tank.png" alt="" style="' + style + '">';
        }
    Quagga.stop();
})

