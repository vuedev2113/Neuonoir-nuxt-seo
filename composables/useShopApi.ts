const config = useRuntimeConfig()

export const useShopApi = () => {
    return {
        getProducts: () => {
            return useFetch(config.public.baseURL + "/api/products");
        }
    }
}