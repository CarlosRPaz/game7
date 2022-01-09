import sanityClient from '@sanity/client'

export default sanityClient({
    projectId: "jauwdlqi",
    dataset: "production",
    apiVersion: '2021-08-31', // use a UTC date string
    useCdn: false, // `false` if you want to ensure fresh data
})