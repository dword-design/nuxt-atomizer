// TODO: https://github.com/acss-io/atomizer/issues/1054
declare module 'atomizer-plugins' {
  export const vite: (options: {
    config?: import('atomizer').AtomizerConfig;
    outfile?: string;
  }) => import('vite').PluginOption;
}
