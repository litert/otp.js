import { defineConfig } from 'vitepress'
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@litert/otp",
  description: "The TOTP & HOTP implement for Node.JS.",
  base: '/projects/otp.js/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/quick-start' },
      { text: 'API Reference', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Quick Start', link: '/guides/quick-start' },
          { text: 'CLI Usage', link: '/guides/cli-usage' },
        ]
      },
      {
        text: 'API Reference',
        items: typedocSidebar,
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/litert/otp.js' }
    ]
  }
})
