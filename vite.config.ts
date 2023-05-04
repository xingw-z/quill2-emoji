import { defineConfig } from 'vite';
// @ts-ignore
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({
    beforeWriteFile: (filePath: string, content: string) => {
      const  newFilePath = filePath.replace('src/', '')
      return {
        filePath: newFilePath,
        content
      }
    }
  })],
  build: {
    rollupOptions: {
      external: ['quill']
    },
    lib: {
      entry: './lib/main.ts',
      name: 'index',
      formats: ['es'],
      fileName: (format) => 'index.js'
    }
  }
})
