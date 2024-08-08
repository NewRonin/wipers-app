import { defineStore } from "pinia"

export const useMainStore = defineStore('main', () => {
    const PORTAL_API_HOST = ref(process.env?.PORTAL_API_HOST || '')
    const PORTAL_HTTP_PROTOCOL = ref(process.env?.PORTAL_HTTP_PROTOCOL || '')

    const baseUrl = computed(() => `${PORTAL_HTTP_PROTOCOL.value}://${PORTAL_API_HOST.value}`) 
  
    return { PORTAL_API_HOST, PORTAL_HTTP_PROTOCOL, baseUrl }
})