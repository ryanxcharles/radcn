import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    port: Number(process.env.PORT ?? 4601),
    strictPort: true,
  },
  plugins: [tailwindcss(), reactRouter()],
})
