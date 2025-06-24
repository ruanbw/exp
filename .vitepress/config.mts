import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "exp",
  description: "A VitePress Site",
  srcDir: 'src',
  base: '/exp/',
  themeConfig: {    
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'Guide',
        link: '/guide',
      },
      {
        text: "移动端",
        items: [
          {
            text: "自适应",
            link: "/mobile-terminal/self-adaption"
          }]
      },
            {
        text: "样式",
        items: [
          {
            text: "bem",
            link: "/style/bem"
          }]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
