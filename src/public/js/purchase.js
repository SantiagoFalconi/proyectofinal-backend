const addListeners = () => {
    const purchaseButton = document.querySelectorAll('.purchase');
    purchaseButton.forEach(button => {
        button.addEventListener('click', purchase);
    });
}

const purchase = async (event) => {
    try {
        const cartId = localStorage.getItem('cartId');
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.status === 'success') {
            alert(`The purchase was made successfully!`);
            location.reload()
        } else {
            alert('Error during checkout');
        }
    } catch (error) {
        console.error('Error during checkout', error);
    }
}

addListeners();