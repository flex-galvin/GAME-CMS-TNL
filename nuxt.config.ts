export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: './src/client',
  serverDir: './src/server',

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    redisHOST: process.env.REDIS_HOST,
    redisPORT: process.env.REDIS_PORT,
    redisDB: process.env.REDIS_DB,
    redisPREFIX: process.env.REDIS_PREFIX,
    apiSecret: process.env.SECRET,
    cloudfire: process.env.CLOUDFIRE == 'true' ? true : false,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      ipx: process.env.IPX_ON == 'false' ? false : true,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      cookieManageConfig: {
        path: '/',
        maxAge: 1 * 24 * 60 * 60,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      version: process.env.VERSION
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
        { name: 'apple-mobile-web-app-title', content: process.env.NAME },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/pwa/180.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@/assets/app.sass'
  ],

  colorMode: {
    preference: 'dark'
  },

  modules: [
    '@pinia/nuxt', 
    '@nuxt/image', 
    '@nuxt/ui', 
    '@nuxtjs/google-fonts', 
    'nuxt-tiptap-editor', 
    '@nuxtjs/robots', 
    'nuxt-swiper', 
    '@vite-pwa/nuxt', 
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'vi', file: 'vi.json', name: 'Tiếng Việt' },
      { code: 'en', file: 'en.json', name: 'English' },
      // { code: 'zh', file: 'zh.json', name: '中文' },
      // { code: 'ko', file: 'ko.json', name: '한국어' },
      // { code: 'ja', file: 'ja.json', name: '日本語' }
    ],
    defaultLocale: 'vi',
    lazy: true,
    strategy: 'no_prefix',
    langDir: 'locales/',
    experimental: {
      localeDetector: 'localeDetector.ts'
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  site: {
    url: process.env.CLIENT_URL, 
    name: process.env.NAME
  },

  tiptap: {
    prefix: 'Tiptap'
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Lexend: [300,400,500,600,700,800,900]
    }
  },

  robots: {
    disallow: ['/admin', '/manage/*', '/.nuxt/*', '/*?query=', '/*?page=', '/*?sort=', '/*?filter='],
    sitemap: '/sitemap.xml', 
    blockNonSeoBots: true, // Nuclei, WikiDo, Riddler, PetalBot, Zoominfobot, Go-http-client, Node/simplecrawler, CazoodleBot, dotbot/1.0, Gigabot, Barkrowler, , BLEXBot, magpie-crawler
  },

  icon: {
    serverBundle: 'remote',
  },

  image: {
    provider: 'ipx',
    domains: [
      process.env.DOMAIN as string
    ]
  },

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    includeAssets: [
      'favicon.ico', 
      'robots.txt', 
      'pwa/180.png'
    ],
    manifest: {
      name: process.env.NAME,
      short_name: process.env.SHORT_NAME,
      description: process.env.DESCRIPTION,
      theme_color: '#03678D',
      background_color: '#03678D',
      display: 'standalone',
      start_url: '/',
      orientation: "portrait",
      lang: 'vi',
      icons: [
        { src: '/pwa/64.png', sizes: "64x64", type: 'image/png' },
        { src: '/pwa/144.png', sizes: "144x144", type: 'image/png' },
        { src: '/pwa/192.png', sizes: "192x192", type: 'image/png' },
        { src: '/pwa/512.png', sizes: "512x512", type: 'image/png', purpose: 'any'  },
        { src: '/pwa/512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      sourcemap: true,
      globPatterns: ['**/*.{js,css,html,png,svg}'],
    }
  },

  // vite: {
  //   css: {
  //     preprocessorOptions: {
  //       sass: {
  //         silenceDeprecations: ['legacy-js-api'],
  //       }
  //     }
  //   }
  // },

  compatibilityDate: '2025-06-01'
})