export const useStrapiLocale = () => {
    const { locale } = useI18n()

    return computed(() => {
        const l = locale.value || 'en'
        return l.includes('-') ? l.split('-')[0] : l
    })
}
