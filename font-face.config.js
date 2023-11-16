
module.exports = {
    input: {
        dir: './Roboto_Condensed/static',
    },
    output: {
        dir: './fontdata',
        resourceDir: './fontdata/fontResources',
        cssFileName: 'font-face.css',
    },
    fonts: [
        {
            name: 'RobotoCondensed',
            weight: 200,
            style: 'normal',
            file: 'RobotoCondensed-Thin',
        },
        {
            name: 'RobotoCondensed',
            weight: 400,
            style: 'normal',
            file: 'RobotoCondensed-Light',
        },
        {
            name: 'RobotoCondensed',
            weight: 600,
            style: 'normal',
            file: 'RobotoCondensed-Medium',
        },
        {
            name: 'RobotoCondensed',
            weight: 600,
            style: 'normal',
            file: 'RobotoCondensed-SemiBold',
        },
        {
            name: 'RobotoCondensed',
            weight: 600,
            style: 'normal',
            file: 'RobotoCondensed-Black',
        },
    ],
};