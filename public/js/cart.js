let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('cartJs : ' , cart);
const displayCart = (cart) => {
    const cartDiv = document.getElementById('cart-section');
    cartDiv.innerHTML = '';
    
    if (cart.length === 0) {
        cartDiv.innerHTML = `<h2>Your shopping cart looks empty</h2>
        <span class="material-icons">
            sentiment_dissatisfied
        </span> 
        <img src='public/images/shopping-cart.png'>`;
        return;
    }

    cart.forEach(element => {
        let reviewStarNum = Math.round(element.rating);
        let starDiv = document.createElement('div');
        for (let i = 0; i < reviewStarNum; i++) {
            starDiv.innerHTML += '<p>★</p>';
        }
        let discountedPrice = Math.ceil((element.product.price - (element.product.price * element.product.discountPercentage / 100)) * Math.pow(10, 2)) / Math.pow(10, 2);
        
        cartDiv.innerHTML += `
            <div class='cart-item' id=${element.product.id}>
                <input type='checkbox' ${element.checked ? 'checked' : ''}>
                <img src=${element.product.images[0]} alt='item image'>
                <div class='item'>
                    <div class='item-information'>
                        <div class='item-title'>
                            <p>${element.product.title}</p>
                            <div class='combined-price'>
                                <p>${discountedPrice} $</p>
                                <p class='real-price'>${element.product.price} $</p>
                            </div>
                            ${starDiv.outerHTML}
                        </div>
                        <p>${element.product.description}</p>
                    </div>
                </div>
                <div class='quantity-container'>
                    <div class='quantity'>
                        <span class="material-icons" id='delete'>delete</span>
                        <input type='number' value=${element.quantity}>
                    </div>
                    <a>update</a>
                </div>
            </div>`;
    });

   //deletestvis
    document.querySelectorAll('#delete').forEach(bin => {
        bin.addEventListener('click', (e) => {
            deleteItem(bin.parentElement.parentElement.parentElement.id); 
        });
    });

    //checkboqsebistvis
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        c.addEventListener('change', () => {
            const itemId = parseInt(c.parentElement.id);
            const item = cart.find(e => e.product.id === itemId);
            if (item) {
                item.checked = c.checked;
                localStorage.setItem('cart', JSON.stringify(cart)); 
                checkoutDisplay(cart); 
            }
        });
    });
};

const deleteItem = (itemId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    //!= erti tolobit imitoro erti stringia meore int 
    cart = cart.filter(e => e.product.id != itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart(cart);
    checkoutDisplay(cart);
    cartIcon();
};

const checkoutDisplay = (cart) => {
    let bill = 0;
    let count = 0;
    cart.forEach(element => {
        let discountedPrice = Math.ceil((element.product.price - (element.product.price * element.product.discountPercentage / 100)) * Math.pow(10, 2)) / Math.pow(10, 2);
        let numberInput = document.querySelector(`.cart-item[id = '${element.product.id}']`);
        if (element.checked) {
            bill += discountedPrice * element.quantity; 
            count ++;
            if(numberInput.value !== element.quantity){
                console.log('aq shemodis')
                numberInput.value = element.quantity;
                console.log(numberInput.value)
            }
            
        }
    });
    bill =  Math.ceil(bill * Math.pow(10, 2)) / Math.pow(10, 2);
    const checkOut = document.querySelector('#check-out-section');
    checkOut.innerHTML = '';
    checkOut.innerHTML = `
        <div id = 'check-out'>
            <p>You have chosen <span>${count}</span> items</p>
            <p>Your total is:<br><span> ${bill} $</span></p>
            <a href="#">Check out</a>
        </div>
    `;
    document.querySelectorAll('.cart-item').forEach(item =>{
        item.addEventListener('click', (e)=>{
            if(!e.target.outerHTML.includes('input') & !e.target.outerHTML.includes('<a>') & !e.target.outerHTML.includes('span')){
                displaySingleProductPage(item.id);
            }
        })
    })

    document.querySelectorAll('.quantity-container >a').forEach(button =>{
        button.addEventListener('click', ()=>{
            const changedElementId = button.parentElement.parentElement.id;
            console.log(button.parentElement);
            const inputQuantity = button.previousElementSibling.querySelector('input[type="number"]').value;
            const item = cart.find(p => p.product.id == changedElementId);
            console.log(changedElementId)
            if (item) {
                console.log('aq shemovida')
                item.quantity = parseInt(inputQuantity);
                localStorage.setItem('cart', JSON.stringify(cart));
                checkoutDisplay(cart); 
            }
        })
    })
};


displayCart(cart);
checkoutDisplay(cart);