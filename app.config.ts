import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'volunteam',
    slug: 'volunteam',
    owner: 'gpoquendo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#031A62',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
    },
    web: {
        favicon: './assets/favicon.png',
    },
    plugins: [
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you add them to events.',
                cameraPermission: 'The app accesses your camera to let you add pictures to events.',
            },
        ],
        "expo-font"
    ],
    extra: {
        // eas: {
        //     projectId: '954f3b8e-1155-4f8f-8601-a2b3126da39e',
        // },
        "eas": {
        "projectId": "422959f3-7014-406d-92d3-e44fb1608cae"
      },
        IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    },
});
