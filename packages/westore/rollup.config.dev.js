import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'
import dts from 'rollup-plugin-dts'

const pkg = require('./package.json')

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'module',
        sourcemap: true
      },
      {
        file: pkg.commonjs,
        format: 'cjs',
        exports: 'auto',
        sourcemap: true
      }
    ],
    plugins: [resolve(), commonjs(), typescript(), sourceMaps()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'module'
    },
    plugins: [dts()]
  }
]
