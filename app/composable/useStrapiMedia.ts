export function useStrapiMedia() {
    const config = useRuntimeConfig()
    const baseUrl = computed(() => (config.public.backend || '').replace(/\/$/, ''))

    const strapiMediaUrl = (path?: string) => {
        if (!path) return ''
        if (/^https?:\/\//i.test(path)) return path
        return `${baseUrl.value}${path}`
    }

    return { strapiMediaUrl }
}