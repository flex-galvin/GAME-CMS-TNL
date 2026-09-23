export default defineAppConfig({
  ui: {
    primary: 'yellow',
    
    gray: 'neutral',

    button: {
      font: 'font-semibold',
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-2xl',
      color: {
        gray: {
          solid: 'ring-0 bg-card-box'
        },
        white: {
          solid: 'ring-0 bg-card-box'
        },
        
      }
    },

    buttonGroup: {
      rounded: 'rounded-2xl',
    },

    avatar: {
      rounded: 'rounded-2xl',
      background: 'bg-card-box'
    },

    card: {
      background: 'bg-card-box',
      divide: 'dark:divide-black/10',
      ring: 'ring-0',
      base: 'relative overflow-x-hidden overflow-visible',
      rounded: 'rounded-2xl',
    },

    input: {
      default: {
        color: 'gray',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-2xl',
      color: { gray: { outline: 'dark:ring-gray-800 bg-card-box' }} 
    },

    alert:{
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-2xl',
    },

    badge: {
      base: 'relative',
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-2xl',
      default: {
        variant: 'soft',
        color: 'gray'
      }
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible',
      rounded: 'rounded-2xl',
      background: 'dark:bg-transparent '
    },

    slideover: {
      overlay: {
        background: 'dark:bg-black/50 backdrop-blur'
      },
      background: 'bg-card-box'
    },

    notifications: {
      position: 'left-1/2 translate-x-[-50%] top-0 bottom-auto',
      container: 'px-2 sm:px-2 py-2 sm:py-2 space-y-0.5',
    },
    
    notification: {
      background: 'bg-card',
      title: 'text-sm font-semibold text-gradient FTV hidden',
      description: 'dark:text-gray-200',
      rounded: 'rounded-2xl',
      ring: 'ring-0',
      gap: 'gap-4',
      progress: {
        base: 'h-0.5'
      },
      icon: {
        base: 'w-6 h-6'
      }
    },

    formGroup: {
      wrapper: 'mb-4',
      container: 'mt-2'
    },

    table: {
      wrapper: 'Table',
      divide: 'dark:divide-black/10',
      tbody: 'dark:divide-black/10',
      th: {
        base: 'whitespace-nowrap'
      },
      default: {
        sortButton: {
          class: 'bg-card-box px-3',
        }
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-0.5',
      rounded: '!rounded-full min-w-[32px] justify-center',
      default: {
        size: 'xs',
        activeButton: {
          class: 'bg-btn'
        }
      }
    },

    popover: {
      rounded: 'rounded-2xl',
    },

    select: {
      default: {
        loadingIcon: 'i-bx-loader-alt',
        color: 'gray',
      },
      rounded: 'rounded-2xl',
      color: {
        gray: {
          outline: 'dark:ring-gray-800 bg-card-box'
        }
      }
    },

    selectMenu: {
      base: 'overflow-x-hidden HideScroll',
      rounded: 'rounded-2xl',
      padding: 'p-1',
      shadow: 'shadow-xl',
      background: 'bg-card-box backdrop-blur-3xl',
      ring: 'dark:ring-0',
      option: {
        rounded: 'rounded-2xl',
        padding: 'px-3 py-2',
        active: 'bg-card-box backdrop-blur-3xl',
        selected: 'bg-card-box backdrop-blur-3xl'
      },
      input: 'rounded-2xl bg-card-black border-b-0'
    },

    textarea: {
      default: {
        color: 'gray',
      },
      rounded: 'rounded-2xl',
      color: {
        gray: {
          outline: 'dark:ring-gray-800 bg-card-box'
        }
      }
    },

    tabs: {
      list: {
        rounded: 'rounded-2xl',
        background: 'bg-card-box',
        marker: {
          rounded: 'rounded-xl',
          background: ''
        },
        tab: {
          rounded: 'rounded-xl',
          background: '',
          active: 'bg-btn'
        }
      }
    },

    chip: {
      base: 'dark:text-white z-[1] font-semibold ring-0',
      background: 'dark:bg-{color}-600',
      size: {
        '2xl': 'text-[12px] p-2'
      },
      position: {
        'top-right': 'top-0 right-1'
      },
      default: {
        size: '2xl',
      }
    },

    verticalNavigation: {
      rounded: 'rounded-2xl',
      base: 'MenuItem',
      ring: 'ring-0 dark:ring-0',
      badge: {
        base: 'rounded-2xl',
      },
      padding: 'py-2',
      active: 'MenuItem--Active',
    },

    skeleton: {
      background: 'bg-card-box',
      rounded: 'rounded-2xl'
    },

    dropdown: {
      background: 'bg-gray-1000',
      padding: 'p-0',
      shadow: 'shadow-xl',
      rounded: 'rounded-2xl',
      ring: 'ring-0 dark:ring-0',
      divide: 'dark:divide-gray-800',
      item: {
        rounded: 'rounded-none',
        padding: 'px-2 py-2'
      }
    },

    toggle: {
      inactive: 'bg-card-black',
      active: 'dark:bg-{color}-500'
    }
  }
})