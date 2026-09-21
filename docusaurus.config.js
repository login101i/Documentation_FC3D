// @ts-check
import path from 'path';
import {fileURLToPath} from 'url';
import {themes as prismThemes} from 'prism-react-renderer';

const siteDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'FastCube3D — Konfigurator blatów',
  tagline: 'Metodologia wdrażania konfiguratora blatów',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://login101i.github.io',
  baseUrl: '/Documentation_FC3D/',
  trailingSlash: false,

  organizationName: 'login101i',
  projectName: 'Documentation_FC3D',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  plugins: [
    function componentsAlias() {
      return {
        name: 'components-alias',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@components': path.resolve(siteDir, 'src/components'),
              },
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/wizualizacja-blatow-3d.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: false,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        title: 'FastCube3D',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Dokumentacja',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `FastCube3D — konfigurator blatów. Dokumentacja techniczna.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['sql'],
      },
    }),
};

export default config;
