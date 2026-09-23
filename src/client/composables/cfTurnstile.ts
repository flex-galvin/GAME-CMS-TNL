import { ref, onMounted, onBeforeUnmount } from 'vue'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

let scriptPromise: Promise<void> | null = null

function loadScript() {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()

    const exist = document.querySelector(`script[src="${TURNSTILE_SRC}"]`)
    if (exist) {
      exist.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })

  return scriptPromise
}

export function useCFTurnstile(options: {
  siteKey: string
  onSuccess: (token: string) => void
}) {
  const el = ref<HTMLElement | null>(null)
  const widgetId = ref<string | null>(null)
  const token = ref('')

  const render = async () => {
    if (!el.value || !options.siteKey) return

    await loadScript()

    // @ts-expect-error
    widgetId.value = window.turnstile.render(el.value, {
      sitekey: options.siteKey,
      theme: 'dark',
      size: 'flexible',
      callback: (t: string) => {
        token.value = t
        options.onSuccess(t)
      },
      'expired-callback': () => {
        token.value = ''
      }
    })
  }

  const reset = () => {
    if (window.turnstile && widgetId.value) {
      window.turnstile.reset(widgetId.value)
      token.value = ''
    }
  }

  const remove = () => {
    if (window.turnstile && widgetId.value) {
      try { window.turnstile.remove(widgetId.value) } catch (_) {}
    }
    widgetId.value = null
    token.value = ''
  }

  onMounted(render)
  onBeforeUnmount(remove)

  return {
    el,
    token,
    render,
    reset,
    remove
  }
}
