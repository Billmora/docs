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
      { text: 'Docs', link: '/docs/introduction' },
      { text: 'Development', link: '/development/introduction' },
      { text: 'Marketplace', link: '#' }
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/docs/introduction' },
          ]
        },
        {
          text: 'Installation',
          items: [
            { text: 'Linux Server', link: '/docs/installation/linux-server' },
            { text: 'Web Hosting', link: '/docs/installation/web-hosting' }
          ]
        }
      ],
      '/development/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/development/introduction' },
          ]
        },
        {
          text: 'Plugin',
          items: [
            {
              text: 'Reference',
              collapsed: true,
              items: [
                { text: 'Conventions', link: '/development/plugins/reference/conventions' },
                { text: 'Schema', link: '/development/plugins/reference/schema' },
                { text: 'Events', link: '/development/plugins/reference/events' },
              ]
            },
            { text: 'Gateway', link: '/development/plugins/gateway' },
            { text: 'Provisioning', link: '/development/plugins/provisioning' },
            { text: 'Module', link: '/development/plugins/module' },
          ]
        },
        {
          text: 'Themes',
          items: [
            {
              text: 'Reference',
              collapsed: true,
              items: [
                { text: 'Conventions', link: '/development/themes/reference/conventions' },
                { text: 'Vite Config', link: '/development/themes/reference/vite-config' },
                { text: 'Configure', link: '/development/themes/reference/config' },
              ]
            },
            { text: 'Admin', link: '/development/themes/admin' },
            { text: 'Client', link: '/development/themes/client' },
            { text: 'Portal', link: '/development/themes/portal' },
            { text: 'Email', link: '/development/themes/email' },
            { text: 'Invoice', link: '/development/themes/invoice' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Billmora/billmora' },
      { icon: 'discord', link: 'https://dsc.gg/billmora' }
    ]
  },
  cleanUrls: true,
})
