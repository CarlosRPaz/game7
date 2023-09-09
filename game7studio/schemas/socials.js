export default {
    name: 'socials',
    title: 'Socials',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'showInstagram',
            title: 'Show Instagram',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showX',
            title: 'Show X',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showDiscord',
            title: 'Show Discord',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showYoutube',
            title: 'Show Youtube',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'instagramLink',
            title: 'Paste your Instagram link',
            type: 'string',
        },
        {
            name: 'xLink',
            title: 'Paste your X link',
            type: 'string',
        },
        {
            name: 'discordLink',
            title: 'Paste your Discord link',
            type: 'string',
        },
        {
            name: 'youtubeLink',
            title: 'Paste your YouTube link',
            type: 'string',
        },
    ],

    preview: {
        select: {
            title: 'title',
        },
    },
}
