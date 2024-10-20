import * as Sentry from '@sentry/vue'
export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()

    Sentry.init({
        app: nuxtApp.vueApp,
        dsn: 'https://cd88639078275cde90531dcfac390ca5@o4506371483893760.ingest.sentry.io/4506384106913792',
        // Configure this whole part as you need it!
        tracesSampleRate: 0.2, // Change in prod
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', 'https://neuronoir.art'],
        replaysSessionSampleRate: 1.0, // Change in prod
        replaysOnErrorSampleRate: 1.0, // Change in prod if necessary
    })
})