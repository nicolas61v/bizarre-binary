import { config, fields, singleton, collection } from '@keystatic/core';

export default config({
    storage: {
      kind: 'github',
      repo: 'nicolas61v/bizarre-binary',
    },

    singletons: {
        hero: singleton({
            label: 'Sección Principal',
            schema: {
                title: fields.text({ label: 'Título', description: 'El título grande del inicio' }),
                subtitle: fields.text({ label: 'Subtítulo', description: 'Texto pequeño arriba del título' }),
                tagline: fields.text({ label: 'Frase destacada', description: 'Frase debajo del título' }),
                image: fields.image({
                    label: 'Foto Principal',
                    description: 'La foto grande que aparece en el inicio',
                    directory: 'public/imgs/hero',
                    publicPath: '/imgs/hero/',
                }),
            },
        }),
    },
    collections: {
        gallery: collection({
            label: 'Galería de Modelos',
            slugField: 'name',
            path: 'src/content/gallery/*',
            schema: {
                name: fields.slug({ name: { label: 'Nombre de la Modelo' } }),
                tag: fields.text({ label: 'Etiqueta', description: 'Ej: Top Model, Elite, Nueva' }),
                image: fields.image({
                    label: 'Foto de la Modelo',
                    directory: 'public/imgs/gallery',
                    publicPath: '/imgs/gallery/',
                }),
            },
        }),
        benefits: collection({
            label: 'Beneficios',
            slugField: 'title',
            path: 'src/content/benefits/*',
            schema: {
                title: fields.slug({ name: { label: 'Título del Beneficio' } }),
                description: fields.text({ label: 'Descripción', description: 'Texto corto del beneficio', multiline: true }),
                image: fields.image({
                    label: 'Imagen del Beneficio',
                    directory: 'public/imgs/benefits',
                    publicPath: '/imgs/benefits/',
                }),
            },
        }),
    },
});
