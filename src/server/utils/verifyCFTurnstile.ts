export default async (secret: string, token: string, ip?: string) => {
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: secret,
          response: token,
          remoteip: ip
        })
      }
    )
    const data = await res.json()
    if(!data.success) throw 'Xác thực Captcha thất bại'
  }
  catch (e:any) {
    throw e.toString()
  }
}