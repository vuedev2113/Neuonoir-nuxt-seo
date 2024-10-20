export const usePriceSearch = (productId:string, products:any) => {
    const product = products.filter((product:any) => {
        return product.id == productId
    })

    let minPrice = 9999
    product.variants.forEach((variant:any) => {
        if (variant.price < minPrice) {
            minPrice = variant.price
        }
    })

    return minPrice
}