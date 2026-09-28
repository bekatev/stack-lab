import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const root = path.dirname(fileURLToPath(import.meta.url))

export default {
  entry: './src/widget/canvas-widget.js',
  output: {
    filename: 'widget.js',
    path: path.resolve(root, 'dist-webpack'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/widget/index.html',
    }),
  ],
}
