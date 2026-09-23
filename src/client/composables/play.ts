export const usePlay = () => {
  const runtimeConfig = useRuntimeConfig()
  const configStore = useConfigStore()

  function guest(token : string) {
    if(!!runtimeConfig.public.dev) navigateTo({ path: '/play', query: { token: token }})
    else {
      if(!!configStore.config.game.ssl) navigateTo({ path: '/play', query: { token: token }})
      else location.href = `http://game.${runtimeConfig.public.domain}/play?token=${token}`
    }
  }

  function manage(data : any) {
    const query = new URLSearchParams(data).toString();
    const url = !!runtimeConfig.public.dev || !!configStore.config.game.ssl ? `/play/manage?${query}` : `http://game.${runtimeConfig.public.domain}/play/manage?${query}`

    useTo().openNewTab(url)

    // const newTab = window.open("about:blank", "_blank")
    // if (!newTab) return window.location.href = url

    // newTab.document.open()
    // newTab.document.write(`
    //   <html>
    //     <head><title>Đang chuyển hướng...</title></head>
    //     <body>Đang chuyển hướng tới trang trò chơi...</body>
    //   </html>
    // `)
    // newTab.document.close()
    // newTab.location.href = url
  }

  return { guest, manage }
}