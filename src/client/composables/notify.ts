export const useNotify = () => {
  const toast = useToast()

  function error(text : string) {
    toast.add({
      title: 'Error',
      color: 'rose',
      icon: 'i-material-symbols-error',
      description: text,
      timeout: 2000
    })
  }

  function success(text : string) {
    toast.add({
      title: 'Success',
      color: 'green',
      icon: 'i-icon-park-solid-success',
      description: text,
      timeout: 2000
    })
  }

  return { error, success }
}