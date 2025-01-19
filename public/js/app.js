//take data from fake api
async function fetchData() {
    try {
        const response = await fetch('https://dummyjson.com/products?fbclid=IwZXh0bgNhZW0CMTEAAR3lKGeZJp25hNonrkRNS43qwOsluh675Iw0u4Un5NOwXKs9bNKcxR4n3hE_aem_0CbR6cVZsH31-b-k4pIfFA');
        const json = await response.json();
        const data = json.products;
        localStorage.setItem('products', JSON.stringify(data));


        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}


//display
async function run() {
    const data = await fetchData();

    let bestSeller = [...data].sort((a, b) => b.discountPercentage - a.discountPercentage);
    bestSeller = bestSeller.slice(0, 10);
    localStorage.setItem('bestSeller', JSON.stringify(bestSeller));

    //tu mtavar gverdzea best sellerebi gamoitanos
    let currentWindow = window.location.pathname;
    console.log(currentWindow)
    // '/' es microsoft edgeis default index.html path aris 
    if (currentWindow.includes('index.html') || currentWindow == '/') {
        console.log(bestSeller);
        loadProducts(bestSeller);
        scrollProducts();
        slider();
        discount(data);
        //category browse from landing page
        categorySection(data);
        let category = document.querySelectorAll('.categories>div');
        category.forEach(div => {
            div.addEventListener('click', (e) => {
                searchProduct(div.id);
            })
        })
    } else if (currentWindow.includes('product.html')) {
        document.querySelector('.single').addEventListener('click', (e) => {
            addToCart(document.querySelector('.single').id, data);
        })
    }
    document.querySelectorAll('.each').forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target.id !== 'cart-button' & e.target.id !== 'add-cart') {
                displaySingleProductPage(element.id, data);
            } else {
                addToCart(element.id, data);
            }
        });
    });
    //searching for products
    let searchBar = document.querySelector('.search-bar input');
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProduct(searchBar.value);
        }
    })

    let searchIcon = document.querySelector('#search');
    searchIcon.addEventListener('click', () => {
        searchProduct(searchBar.value);
    })
    cartIcon();

}


//best seller scroll
const scrollProducts = () => {
    const productsContainer = document.querySelectorAll('.product');
    productsContainer.forEach(bestProducts => {
        const allBackButton = document.querySelectorAll('#back');
        const allForwardButton = document.querySelectorAll('#forward');
        if (window.location.href.includes('index.html')) {
            allBackButton.forEach(backButton => {
                backButton.addEventListener('click', () => {
                    bestProducts.scrollBy({
                        left: -300,
                        behavior: 'smooth'
                    });
                });
            })
            allForwardButton.forEach(forwardButton => {
                forwardButton.addEventListener('click', () => {
                    bestProducts.scrollBy({ left: 300, behavior: 'smooth' });
                });
            })

        }
    })

}
//display most discount 
const discount = (data) =>{
    let product = data.sort((a, b)=> b.discountPercentage - a.discountPercentage)[0];
    let container = document.querySelector('#best-discount>div');
    container.innerHTML = `
        <div class="general">
            <h2>${product.title}</h2>
            <div id = 'img-info'>
                    <img src="${product.images[0]}" alt="${product.title}">
                    <div class="info">
                        <p><span>Category:</span> ${product.category}</p>
                        <p><span>Description:</span>${product.description}</p>
                        <p><span>Brand: </span>${product.brand}</p>
                    </div>
            </div>
            <div clas = 'product-info'>
                <div id = 'price'>
                    <p class = 'discount'>${product.discountPercentage} %</p> 
                </div>
            </div> 
        </div>
    `
    container.addEventListener('click', ()=>{
        displaySingleProductPage(product.id);
    })
}

//displaying product html
const loadProducts = (array) => {
    let productContainer = document.querySelectorAll('.product');
    productContainer.forEach(container => {
        container.innerHTML = ``;
        console.log(array);
        //cart array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        array.forEach(element => {
            //product is in the cart
            const inCart = cart.find(p => p.product.id == element.id);

            //dicounted price rounded up 
            let discountedPrice = element.price - (element.price * element.discountPercentage / 100);

            discountedPrice = Math.ceil(discountedPrice * Math.pow(10, 2)) / Math.pow(10, 2);
            container.innerHTML += `
                    <div class = 'each' id = "${element.id}">
                        <img src = ${element.images[0]} alt = 'product-img'>
                        <div class = 'product-info'>
                            <p>${element.title}</p>
                            <div>
                                <p>${discountedPrice} $</p>
                                <p class = 'real-price'>${element.price} $</p>
                                
                                <p class = 'discount'>${element.discountPercentage}% OFF</p>
                            </div>
                            <div class = 'add-cart-container' id = 'cart-button'>
                                <p id = 'cart-button'>add to cart</p>
                                <span class="material-icons cart" id = 'add-cart'>shopping_cart</span>
                            </div>
                        </div>
                    </div>`

            if (inCart) {
                changeCartButton(element.id, cart);
            }
        });
    })

}


//single product page
async function displaySingleProductPage(productId, data) {
    if (!productId) return console.error("Product ID not found");
    localStorage.setItem('selectedProductId', productId);
    window.open('product.html', '_self');
}

//search bar function
async function searchProduct(searchBarValue) {
    localStorage.setItem('searchProductValue', searchBarValue);
    localStorage.setItem('searchTriggered', 'true');
    window.open('shop.html', '_self');

}

async function addToCart(productId, data) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === null) {
        cart = [];
    }
    //ori tolobis gareshe tolad ar tvlida (savaraudod erti stringi iyo da meore int )
    const existingProduct = cart.find(p => p.product.id == productId);
    if (existingProduct) {
        existingProduct.quantity++;
        console.log(cart);
    } else {

        let element = {
            //ertit meti id is mqone produqts amatebda cartshi (arvici rato) da magito gamovakeli
            product: data[productId - 1],
            quantity: 1,
            checked: false
        }

        cart.push(element);
        console.log(cart);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    changeCartButton(productId, cart);
}

const cartIcon = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartIcon = document.querySelector('#cart-icon');
    cartIcon.addEventListener('click', () => {
        console.log('sjemodis');
        window.open('cart.html', '_self');
    })
    let itemQuantity = document.querySelector('#cart-items-quantity');
    itemQuantity.style.display = 'flex';
    if (cart.length > 0) itemQuantity.innerHTML = cart.length;
    else itemQuantity.style.display = 'none';

}
//vanish cart icon after choosing product to buy
const changeCartButton = (productId, cart) => {
    let buttonSpan = document.querySelector(`.each[id="${productId}"] .add-cart-container >span`);
    let buttonP = document.querySelector(`.each[id="${productId}"] .add-cart-container >p`);
    let currentWindow = window.location.pathname;
    if (buttonP && buttonP.innerHTML === 'remove from cart') {
        buttonP.innerHTML = 'add to cart';
        buttonSpan.style.display = 'block'
        buttonP.style.opacity = '';
        //delete from cart
        cart = cart.filter(p => p.product.id != productId);
        console.log(cart);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    else if (buttonSpan && buttonP) {
        buttonSpan.style.display = 'none'
        buttonP.innerHTML = 'remove from cart'
        buttonP.style.opacity = '1'
    }
    cartIcon();
}

const categorySection = (data) => {

    let categories = new Set();
    let imgHref = 'public/images/categories/';
    data.forEach(element => {
        categories.add(element.category);
    })

    let categoryArr = [];
    //add images to categories
    categories.forEach(o => {
        categoryArr.push({
            name: o,
            img: imgHref + o + '.jpg'
        })
    })
    console.log(categoryArr);
    displayCategorySection(categoryArr);
}

const displayCategorySection = (categoryArr) => {
    let catDiv = document.querySelector('.categories');
    catDiv.innerHTML = ''
    categoryArr.forEach(e => {
        catDiv.innerHTML += `
        <div id = ${e.name}>
            <img src = ${e.img} alt = ${e.name}>
            <p>${e.name}</p>
        </div>`
    })
}

const slider = () => {
    const slider = document.querySelector('.slider');
    const sliderImgwrapper = document.querySelector('#slider-img-wrapper');
    const sliderImg = document.querySelectorAll('#slider-img-wrapper img');
    console.log(sliderImg)
    let currIndex = 0;

    //moving slides automatichally
    const moveSlide = (index) => {
        sliderImgwrapper.style.transform = `translateX(-${index * 100}vw)`;
        changeText(index);
    }

    const auto = () => {
        currIndex = (currIndex + 1) % sliderImg.length;

        moveSlide(currIndex);
    }

    let interval = setInterval(auto, 3000);


    //clicking the arrow
    document.querySelector('#west').addEventListener('click', () => {
        currIndex = (currIndex - 1 + sliderImg.length) % sliderImg.length;
        moveSlide(currIndex);
        resetAutoSlide();
    })
    document.querySelector('#east').addEventListener('click', () => {
        currIndex = (currIndex + 1) % sliderImg.length;
        moveSlide(currIndex);
        resetAutoSlide();
    })
    //reseting automate slide
    const resetAutoSlide = () => {
        clearInterval(interval);
        interval = setInterval(auto, 3000);
    };

}

const changeText = (index) => {
    let text = document.querySelector('#text');
    if (index === 1) {
        document.querySelector('#text h3').innerHTML = "unlock the extraordinary"
        document.querySelector('#text h2').innerHTML = "shopping haven"
    } else if (index === 0) {
        document.querySelector('#text h3').innerHTML = "shopping habit shows your spirit"
        document.querySelector('#text h2').innerHTML = "shop now"
    }
    if (index > 1) {
        text.style.left = '60%';
        text.style.right = '0';
        document.querySelector('#text h3').innerHTML = 'shop outside the box'
        document.querySelector('#text h2').innerHTML = "trendy cart"

    } else {
        text.style.right = '';
        text.style.left = '5%';

    }

}


//start
run();

