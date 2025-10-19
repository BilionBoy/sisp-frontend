/**
 * Utilitários de detecção e identificação de dispositivos
 */

export type DeviceType = 'web' | 'mobile' | 'tablet' | 'unknown'

/**
 * Gera ou recupera ID único do dispositivo
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server'

  const storageKey = 'sisp_device_id'
  let deviceId = localStorage.getItem(storageKey)

  if (!deviceId) {
    // Gerar ID único baseado em timestamp + random
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(storageKey, deviceId)
  }

  return deviceId
}

/**
 * Detecta tipo de dispositivo baseado em user agent e viewport
 */
export function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'unknown'

  const ua = navigator.userAgent.toLowerCase()
  const width = window.innerWidth

  // Mobile
  if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile'
  }

  // Tablet
  if (/ipad|tablet|playbook|silk/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'tablet'
  }

  // Desktop/Web
  return 'web'
}

/**
 * Coleta informações detalhadas do dispositivo
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      device_id: 'server',
      device_type: 'unknown' as DeviceType,
      user_agent: 'server',
      screen_width: 0,
      screen_height: 0,
      viewport_width: 0,
      viewport_height: 0,
      platform: 'server',
      language: 'pt-BR',
      online: false,
    }
  }

  return {
    device_id: getDeviceId(),
    device_type: getDeviceType(),
    user_agent: navigator.userAgent,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    platform: navigator.platform,
    language: navigator.language,
    online: navigator.onLine,
  }
}

/**
 * Verifica se é dispositivo móvel
 */
export function isMobile(): boolean {
  return getDeviceType() === 'mobile'
}

/**
 * Verifica se é tablet
 */
export function isTablet(): boolean {
  return getDeviceType() === 'tablet'
}

/**
 * Verifica se é desktop/web
 */
export function isWeb(): boolean {
  return getDeviceType() === 'web'
}

/**
 * Verifica se dispositivo está online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return false
  return navigator.onLine
}

/**
 * Escuta mudanças no status de conexão
 */
export function onConnectionChange(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}
