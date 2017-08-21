module.exports = {
    entry: './dev/index.js',
    output: {
        path: __dirname + '/build/js',
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};