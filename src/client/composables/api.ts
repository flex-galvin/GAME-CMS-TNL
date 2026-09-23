import type { IResp } from '~~/types'

export const useAPI = async (path : string, post?: any, options: any = {}) => {
  const authStore = useAuthStore()

  // Server
  if(import.meta.server){
    try {
      // @ts-expect-error
      const { data, error } = await useFetch(`/api/${path}`, {
        method: !!post ? 'POST' : 'GET',
        body: !!post ? post : null,
        headers: {
          ...options.headers,
        },
        watch: false,
        ...options
      })
      if(error?.value) throw { code: error.value?.data?.statusCode, message: error.value?.data?.statusMessage }

      const res = data.value as IResp
      if(!res) throw { code: 500, message: 'Không lấy được dữ liệu từ máy chủ' }

      const { code, message, result } = res
      if(code != 200) throw { code: code, message: message }

      return result
    }
    catch(err : any){
      let code = 500, message = String(err)
      if (err !== null && typeof err === 'object' && !Array.isArray(err)) code = err.code ?? code, message = err.message ?? message

      if(code == 401) authStore.removeAuth(true)
      if(code == 500) throw createError({ statusCode: code, statusMessage: message })
      return Promise.reject(err.toString())
    }
  }

  // Client
  if(import.meta.client){
    try {
      // @ts-expect-error
      const res = await $fetch(`/api/${path}`, {
        method: !!post ? 'POST' : 'GET',
        body: !!post ? post : null,
        headers: {
          ...options.headers,
        },
        watch: false,
        ...options
      }) as IResp
      if(!res) throw { code: 500, message: 'Không lấy được dữ liệu từ máy chủ' }

      const { code, message, result } = res
      if(code != 200) throw { code: code, message: message }

      if(message) useNotify().success(message)
      return result
    }
    catch(err : any){
      let code = 500, message = String(err)
      if (err !== null && typeof err === 'object' && !Array.isArray(err)) code = err.code ?? code, message = err.message ?? message

      useNotify().error(message)

      if(code == 401) authStore.removeAuth(true)
      if(code == 500) showError({ statusCode: code, statusMessage: message })
      return Promise.reject(err.toString())
    }
  }
}