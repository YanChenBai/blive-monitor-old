import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: './',
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('webview')
          }
        }
      }),
      vueJsx(),
      UnoCSS({
        configFile: './uno.config.{js,ts,mjs,mts}'
      }),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      {
        name: 'remove_export_default_Sp',
        generateBundle(_, bundle) {
          for (const fileName in bundle) {
            const file = bundle[fileName]
            if (file.type === 'chunk') {
              // 在这里对代码进行处理，例如查找并替换特定的模式
              file.code = file.code.replace('export default', '')
            }
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: 'dist_plugin',
      rollupOptions: {
        input: {
          plugin: 'src/main.plugin.ts'
        },
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    }
  }
})
