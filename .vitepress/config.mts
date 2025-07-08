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
    outline: {
      level: [3,4]
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
      },
      {
        text: "网络协议",
        items: [
          {
            text: "TCP与UDP的区别",
            link: "/network-protocol/tcp-and-udp"
          }]
      },
      {
        text: "浏览器",
        items: [
          {
            text: "输入网址到页面渲染完毕的过程",
            link: "/browser/website-address-to-page"
          },
          {
            text: "事件循环",
            link: "/browser/event-loop"
          }
        ]
      },
      {
        text: "打包优化",
        items: [
          {
            text: "打包优化",
            link: "/build-optimization/build-optimization"
          }]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ruanbw/exp' }
    ]
  }
})
