import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Sliflow.js',
    description: 'Low effort content slider',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: 'Home',
                link: '/',
            },
            {
                text: 'Guide',
                link: '/guide/about',
            },
            {
                text: 'Examples',
                link: '/examples/index',
            },
            {
                text: 'Changelog',
                link: 'https://github.com/panastasiadist/Sliflow.js/blob/main/CHANGELOG.md',
            },
        ],

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    {
                        text: 'About Sliflow',
                        link: '/guide/about',
                    },
                    {
                        text: 'Core Concepts',
                        link: '/guide/core-concepts',
                    },
                    {
                        text: 'Getting Started',
                        link: '/guide/getting-started',
                    },
                    {
                        text: 'Initialization',
                        link: '/guide/initialization',
                    },
                ],
            },
            {
                text: 'Features',
                items: [
                    {
                        text: 'Conditional Slides',
                        link: '/guide/conditional-slides',
                    },
                    {
                        text: 'Dynamic Slides',
                        link: '/guide/dynamic-slides',
                    },
                    {
                        text: 'Effects & Transitions',
                        link: '/guide/effects-transitions',
                    },
                    {
                        text: 'Layout Awareness',
                        link: '/guide/layout-awareness',
                    },
                    {
                        text: 'Navigation',
                        link: '/guide/navigation',
                    },
                    {
                        text: 'Orientation',
                        link: '/guide/orientation',
                    },
                    {
                        text: 'Replay Strategies',
                        link: '/guide/replay-strategies',
                    },
                    {
                        text: 'Slide Indicators',
                        link: '/guide/slide-indicators',
                    },
                    {
                        text: 'State Updates',
                        link: '/guide/state-updates',
                    },
                    {
                        text: 'Swiping',
                        link: '/guide/swiping',
                    },
                    {
                        text: 'Timed Transitions',
                        link: '/guide/timed-transitions',
                    },
                    {
                        text: 'Utility Classes',
                        link: '/guide/utility-classes',
                    },
                    {
                        text: 'Other Configurations',
                        link: '/guide/other-configurations',
                    },
                ],
            },
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/panastasiadist/Sliflow.js',
            },
        ],

        search: {
            provider: 'local',
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright:
                'Copyright © 2024-present <a href="https://anastasiadis.me" title="Panagiotis Anastasiadis" target="_blank">Panagiotis Anastasiadis</a>',
        },
    },
});
