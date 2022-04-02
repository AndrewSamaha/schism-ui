const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const routes = require('./routes');
const init = async () => {

    console.log('Routes are', routes);
    const server = new Hapi.Server({
        port: process.env.PORT || 5000,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../build')
            }
        }
    });

    await server.register(Inert);

    server.route(routes);

    /**
     * This is required here because there are references to *.js and *.css in index.html,
     * which will not be resolved if we don't match all remaining paths.
     * To test it out, comment the code below and try hitting /login.
     * Now that you know it doesn't work without the piece of code below,
     * uncomment it.
     */
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });

    const options = {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [
                {
                    module: 'good-console',
                    args: [{ request: '*', response: '*' }]
                },
                'stdout'
            ]
        }
    };

    await server.register({
        plugin: require('good'),
        options,
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

init();
