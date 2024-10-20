// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vite: {
        // @ts-ignore ssr: { noExternal: ["moment"], }
    },
    sourcemap: {
        client: true,
        server: true,
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || "https://api.neuronoir.art",
        },
    },
    head: {
        title: "Neuronoir",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            {
                hid: "description",
                name: "description",
                content: "Dark and Heavy music made in Romania.",
            },
            { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
        ],
    },
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "nuxt-graphql-client",
        [
            "@nuxtjs/google-fonts",
            {
                families: {
                    "Cabin+Sketch": [400, 700],
                    "Barlow+Semi+Condensed": [100, 300, 500, 700, 900],
                },
            },
        ],
        "nuxt-icon",
        "@nuxtjs/plausible",
        "@nuxt/image",
    ],
    sitemap: {
        hostname: "https://neuronoir.art",
        routes: [
            "/shop",
            "/posts",
            "/artists",
            "/releases",
            "/cart",
            "/checkout",
            "/about",
            "/privacy",
        ],
    },
});
