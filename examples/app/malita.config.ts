export default {
    title: 'Hello',
    keepalive: [/./, '/users'],
    proxy: {
        '/api': {
            'target': 'http://jsonplaceholder.typicode.com/',
            'changeOrigin': true,
            'pathRewrite': { '^/api': '' },
        }
    }
}