import { config, fields, singleton, collection } from '@keystatic/core';

export default config({
    // storage: {
    //     kind: 'local',
    // },
    // PARA PRODUCCIÓN (VERCEL/GITHUB):
    // Comenta la sección 'storage' de arriba y descomenta la de abajo cuando tengas tu repo conectado.
    
    storage: {
      kind: 'github',
      repo: 'nicolas61v/bizarre-binary',
    },
    
    singletons: {
        hero: singleton({
            label: 'Hero Section',
            schema: {
                title: fields.text({ label: 'Title' }),
                subtitle: fields.text({ label: 'Subtitle' }),
                tagline: fields.text({ label: 'Tagline' }),
                image: fields.image({
                    label: 'Hero Image',
                    directory: 'public/imgs/hero',
                    publicPath: '/imgs/hero/',
                }),
            },
        }),
    },
    collections: {
        gallery: collection({
            label: 'Gallery',
            slugField: 'name',
            path: 'src/content/gallery/*',
            schema: {
                name: fields.slug({ name: { label: 'Model Name' } }),
                tag: fields.text({ label: 'Tag (e.g. Top Model)' }),
                image: fields.image({
                    label: 'Model Photo',
                    directory: 'public/imgs/gallery',
                    publicPath: '/imgs/gallery/',
                }),
            },
        }),
        benefits: collection({
            label: 'Benefits',
            slugField: 'title',
            path: 'src/content/benefits/*',
            schema: {
                title: fields.slug({ name: { label: 'Benefit Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                image: fields.image({
                    label: 'Success Image',
                    directory: 'public/imgs/benefits',
                    publicPath: '/imgs/benefits/',
                }),
                // Optional: Icon field if needed, but sticking to image for now as primary visual
            },
        }),
    },
});
