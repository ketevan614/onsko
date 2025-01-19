
document.addEventListener('DOMContentLoaded', () => {
    const productId = localStorage.getItem('selectedProductId');

    if (!productId) {
        console.error("No product ID found in localStorage");
        return;
    }
    const products = JSON.parse(localStorage.getItem('products'));
    if (!products) {
        console.error("No products found in localStorage");
        return;
    }


    const product = products.find(p => p.id === parseInt(productId, 10));
    if (!product) {
        console.error("Product not found");
        return;
    }
    sugestedProduct(productId, products);
    //product information
    const container = document.querySelector('#single-product-container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const inCart = cart.find(p => p.product.id == productId);
    container.innerHTML = `
        <div class="general">
            <h2>${product.title}</h2>
            <div id = 'img-info'>
                    <img src="${product.images[0]}" alt="${product.title}">
                    <div class="info">
                        <p><span>Category:</span> ${product.category}</p>
                        <p><span>Description:</span>${product.description}</p>
                        <p><span>Brand: </span>${product.brand}</p>
                        <p><span>Size: </span>${product.dimensions.width} X ${product.dimensions.height} X ${product.dimensions.depth}</p>
                        <p><span>Waranty: </span>${product.warantyInformation}</p>
                        <p><span>Tags: </span> ${product.tags}</p>
                    </div>
            </div>  
        </div>
        <div class = 'buy-container'>   
            <div id = 'price'>
                <p>${product.price}$</p>
                <p class = 'discount'>${product.discountPercentage}%</p>
            </div>
            <div id="shipping">
                <span class="material-icons">local_shipping</span>
                <p>${product.shippingInformation}</p>
            </div>
            <p>${product.returnPolicy}</p>
            <div class="add-cart-container single" id = ${product.id}>
                <p>add to cart</p>
                <span class="material-icons cart" id="add-cart">shopping_cart</span>
            </div>
        </div>
    `;

    if (inCart) {
        console.log('desdcs')
        changeCartButton(productId, cart);
    }


    //reviews
    const reviewArray = product.reviews;
    displayReview(reviewArray);
    addMyComment(reviewArray);

});

const displayReview = (reviewArray) => {
    let reviewContainer = document.querySelector('.review-container');
    reviewContainer.innerHTML = '';
    reviewArray.forEach(user => {
        let reviewStarNum = Math.round(user.rating);
        let starDiv = document.createElement('div');
        if (reviewStarNum <= 5) {
            for (i = 0; i < reviewStarNum; i++) {
                starDiv.innerHTML += '<p>★</p>'
            }
        }
        let userImg = '<span class="material-icons" > account_circle </span>'
        if (user.reviewerName == 'Your Name') {
            userImg = "<img src = 'public/images/myUser.png' alt = 'myPic'></img>"
        }
        reviewContainer.innerHTML += `
            <div class = 'review'>
                ${userImg}
                <div class = 'user'>
                    <div class = 'user-information'>
                        <div class = 'name'>
                            <p>${user.reviewerName}</p>
                            <p class = 'mail'>${user.reviewerEmail}</p>
                        </div>
                        ${starDiv.outerHTML}
                    </div>
                    <p>${user.comment}</p>
                </div>
            </div>
        `
    });

}
//sheni komentaris damateba
const addMyComment = (reviewArray) => {
    const commentInput = document.querySelector('#my-comment input[type= "text"]');
    const numberInput = document.querySelector('#my-comment input[type= "number"]')
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && commentInput.value.trim() !== '') {
            workOnMyComment(reviewArray)
        }
    });
    numberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && commentInput.value.trim() !== '') {
            workOnMyComment(reviewArray);
        }
    })
}
const workOnMyComment = (reviewArray) => {
    const commentInput = document.querySelector('#my-comment input[type= "text"]');
    const numberInput = document.querySelector('#my-comment input[type= "number"]')
    const reviewerName = "Your Name";
    const reviewerEmail = "your.email@example.com";
    const rating = document.querySelector('#my-comment input[type= "number"]').value;
    const newComment = {
        reviewerName,
        reviewerEmail,
        rating,
        comment: commentInput.value.trim()
    };
    document.querySelector('#my-comment input[type= "number"]').value = '';
    reviewArray.push(newComment);
    commentInput.value = '';
    displayReview(reviewArray);
}
//raze dawerazec unda chamoishalos
const reviewToggle = document.getElementById('review-close');
//is rac unda chamoishalos dabla
const reviews = document.querySelector('.review-container');

reviewToggle.addEventListener('click', () => {

    if (reviews.style.display === 'none' || reviews.style.display === '') {

        document.querySelector('.icons #down').style.opacity = '0';
        document.querySelector('.icons #up').style.opacity = '1';
        reviews.style.display = 'block';
    } else {

        reviews.style.display = 'none';
        document.querySelector('.icons #down').style.opacity = '1';
        document.querySelector('.icons #up').style.opacity = '0';
    }
});

const sugestedProduct = (productId, data) => {
    let array = data.filter(element => element.category === data[productId].category & element !== data[productId]).slice(0, 5);
    loadProducts(array);

}