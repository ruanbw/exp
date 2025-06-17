import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "exp",
  description: "A VitePress Site",
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        link: '/pages/guide',
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
