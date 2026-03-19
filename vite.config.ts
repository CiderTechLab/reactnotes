import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// srcのCSSファイルをdistにコピーするプラグイン
const copyCssFilesPlugin = {
  name: "copy-css-files",
  closeBundle: async () => {
    const srcDir = "src";
    const distDir = "dist";

    const copyFiles = (from: string, to: string) => {
      if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
      }
      const files = fs.readdirSync(from);
      files.forEach((file) => {
        const fromPath = path.join(from, file);
        const toPath = path.join(to, file);
        if (fs.statSync(fromPath).isDirectory()) {
          copyFiles(fromPath, toPath);
        } else if (file.endsWith(".css")) {
          fs.copyFileSync(fromPath, toPath);
        }
      });
    };

    copyFiles(srcDir, distDir);
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), copyCssFilesPlugin],
  build: {
    outDir: "dist",
  },
});
