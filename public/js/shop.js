let currentDisplayedProduct;
let globalData;

document.addEventListener('DOMContentLoaded', () => {
    const openedBecauseSearch = localStorage.getItem('searchTriggered');
    const data = JSON.parse(localStorage.getItem('products'));
    globalData = data;
    const bestSeller = JSON.parse(localStorage.getItem('bestSeller'));
    //if shop page was oppened because of searching word
    if (openedBecauseSearch) {
        const searchResultsValue = localStorage.getItem('searchProductValue');
        if (searchResultsValue === "") {
            loadProducts(data);
            currentDisplayedProduct = data;
        } else {
            let searchArr = data.filter(element => searchWord(element, searchResultsValue));
            if (searchArr.length === 0) {
                document.querySelector('.all').innerHTML =
                    "<img src = 'public/images/not.png' alt = 'not found' id  = 'not-found'>"
            } else {
                currentDisplayedProduct = searchArr;
                console.log(searchArr);
                loadProducts(searchArr);
                currentDisplayedProduct = searchArr;
            }
        }
        localStorage.removeItem('searchTriggered');
    } else {
        currentDisplayedProduct = data;
        loadProducts(data);
    }


    //add to cart method

})



//category sort
const categoryContainer = document.querySelector('.browse');
if (categoryContainer) {

    categoryContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'P') filterByCategories(globalData, e.target.id);
        const bestSeller = JSON.parse(localStorage.getItem('bestSeller'));
        if (e.target.id === 'best-seller') {
            currentDisplayedProduct = bestSeller;
            loadProducts(bestSeller);
        }
    })
}


//oppening and closing filter sections

//raze dawerazec unda chamoishalos
const priceToggle = document.getElementById('price-toggle');
//is rac unda chamoishalos dabla
const priceFilter = document.getElementById('price-filter');

priceToggle.addEventListener('click', () => {
    if (priceFilter.style.display === 'none') {
        document.querySelector('.icons #add').style.opacity = '0';
        document.querySelector('.icons #remove').style.opacity = '1';
        priceFilter.style.display = 'block';
    } else {
        priceFilter.style.display = 'none';
        document.querySelector('.icons #add').style.opacity = '1';
        document.querySelector('.icons #remove').style.opacity = '0';
    }
});


//radio button sort
const radio = document.querySelectorAll('input[name = "price-sort"]');

radio.forEach(r => {
    r.addEventListener('change', (e) => {
        console.log('rame');
        if (e.target.checked) {
            sortProduct(currentDisplayedProduct, e.target.id);
            loadProducts(currentDisplayedProduct);
        }
    })
})

const filterByCategories = (array, cat) => {
    const filteredArray = array.filter(product => product.category === cat);
    console.log(filteredArray);
    currentDisplayedProduct = filteredArray;
    loadProducts(filteredArray);
}

const searchWord = (element, value) => {
    if (!value) return false;
    const categoryMatch = element.category.substring(0, value.length) === value;
    const tagMatch = element.tags.some(t => t.substring(0, value.length) === value);
    const nameMatch = element.title.substring(0, value.length) === value;
    return categoryMatch || tagMatch || nameMatch;
}

const sortProduct = (array, sortDirection) => {
    if (sortDirection === 'min-max') {
        array.sort((a, b) => a.price - b.price);
    } else {
        array.sort((a, b) => b.price - a.price);
    }
}



