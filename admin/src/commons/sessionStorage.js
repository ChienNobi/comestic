export function getSessionProducts() {
    return JSON.parse(sessionStorage.getItem('products')) || [];
}

export function saveSessionProducts(products) {
    sessionStorage.setItem('products', JSON.stringify(products));
}

export function addProductToSession(product) {
    let sessionProducts = getSessionProducts();
    const existingProductIndex = sessionProducts.findIndex(p => p._id === product._id);

    if (existingProductIndex !== -1) {
        sessionProducts[existingProductIndex].orderQuantity += 1;
    } else {
        sessionProducts.push({ ...product, orderQuantity: 1 });
    }

    saveSessionProducts(sessionProducts);
    return sessionProducts?.length || 0;
}

export function clearSessionProducts() {
    sessionStorage.removeItem('products');
}
