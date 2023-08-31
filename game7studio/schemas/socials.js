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
            name: 'showFacebook',
            title: 'Show Facebook',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showInstagram',
            title: 'Show Instagram',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showLinkedIn',
            title: 'Show LinkedIn',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showPinterest',
            title: 'Show Pinterest',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'showTwitter',
            title: 'Show Twitter',
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
            name: 'facebookLink',
            title: 'Paste your Facebook link',
            type: 'string',
        },
        {
            name: 'instagramLink',
            title: 'Paste your Instagram link',
            type: 'string',
        },
        {
            name: 'linkedInLink',
            title: 'Paste your LinkedIn link',
            type: 'string',
        },
        {
            name: 'pinterestLink',
            title: 'Paste your Pinterest link',
            type: 'string',
        },
        {
            name: 'twitterLink',
            title: 'Paste your Twitter link',
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
