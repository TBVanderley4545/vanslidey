import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import fse from 'fs-extra';

const outputDirectory = './dist';

fse.removeSync('./dist');

export default {
  input: './src/index.ts',
  output: [
    {
      file: `${outputDirectory}/index.js`,
      format: 'cjs',
    },
    {
      file: `${outputDirectory}/index.min.js`,
      format: 'cjs',
      plugins: [
        terser({
          format: {
            comments: false,
          },
        }),
      ],
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['__tests__/**/*'],
    }),
    copy({
      targets: [{ src: './src/style/**/*', dest: `${outputDirectory}/style` }],
    }),
  ],
};
