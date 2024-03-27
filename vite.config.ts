import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import TurboConsole from "unplugin-turbo-console/vite";
import { ViteAliases } from "vite-aliases";
import vueSetupExtend from "vite-plugin-vue-setup-extend";

// import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        localEnabled: command === "serve",
      }),
      AutoImport({
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后设置 false
          enabled: true,
          // 指定自动导入函数 eslint 规则的文件
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
        vueTemplate: true,
        // 配置文件生成位置(false:关闭自动生成)
        // dts: false,
        dts: "src/typings/auto-imports.d.ts",
      }),
      Components({
        // dirs: ['src/myComponents'], // 按需加载的文件夹
        resolvers: [ElementPlusResolver()],
        dirs: ["src/components", "src/myComponents", "src/**/components"],
        // 配置文件位置 (false:关闭自动生成)
        // dts: false,
        dts: "src/typings/components.d.ts",
      }),
      TurboConsole({
        /* options here */
        // prefix: '前',
        // suffix: '后',
        disableLaunchEditor: true,
        disableHighlight: false,
        // port?: number
        // extendedPathFileNames?: string[]
      }),
      ViteAliases({
        dir: "src",
        prefix: "@",
      }),
      vueSetupExtend(),
    ],
    // resolve: { alias: { '@': path.resolve(__dirname,'./src') } },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    optimizeDeps: {
      include: ["@vue/compiler-dom"],
    },
  };
};
