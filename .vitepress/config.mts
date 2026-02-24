import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Billmora",
  description: "Stop paying for billing software. Billmora automate your hosting operations — invoicing, provisioning, and recurring billing — completely free.",
  head: [
    [
      'link', { rel: 'icon', href: 'https://media.billmora.com/logo/main-bgnone.svg' }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://media.billmora.com/logo/main-bgnone.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Marketplace', link: 'https://market.billmora.com' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Billmora/billmora' },
      { icon: 'discord', link: 'https://dsc.gg/billmora' }
    ]
  },
  cleanUrls: true,
})
