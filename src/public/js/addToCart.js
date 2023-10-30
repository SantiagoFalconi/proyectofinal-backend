const addListeners = () => {
    const addToCartButtons = document.querySelectorAll('.addToCart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    const seeCartButton = document.querySelectorAll('.seeCart');
    seeCartButton.forEach(button => {
        button.addEventListener('click', seeCart);
    });
}

const addToCart = async (event) => {
    const productId = event.target.dataset.id;
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST'
            });
            const data = await response.json();
            cartId = data.message._id;
            localStorage.setItem('cartId', cartId); 
        } catch (error) {
            console.error('Error creating a new cart:', error);
            return;
        }
    }

    try {
        cartId = localStorage.getItem('cartId');
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert(`The product was added correctly! id:${cartId}`);
        } else {
            alert('Error adding product to cart');
        }
    } catch (error) {
        console.error('Error when adding product to cart:', error);
    }
}

const seeCart = async (event) => {
    const cartId = event.target.dataset.id;
    window.location.replace(`/myCart/${cartId}`)
}

addListeners();