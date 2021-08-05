const path = require('path');

//I don't fully get it, but it fixed the problem
//https://github.com/netlify/netlify-lambda/issues/179
const { NODE_EVN = 'production' } = process.env
module.exports = {
    entry: './src/index.ts',
    mode: NODE_EVN,
    target: 'node',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}