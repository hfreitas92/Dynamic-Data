'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({
    port: 3000
});

server.register([Blipp, Inert, Vision], () => {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers'
        //partialsPath: 'views/partials'
});



server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: {
            template: 'index',
            context: {
                title: 'Buying A Car: An Odyssey',
                menu: [
                    {
                        item: 'Ferrari'
                    },
                    {
                        item: 'Motorcycle'
                    },
                    {
                        item: 'Golf Cart'
                    }
                    ],
                message: 'A man goes into a car dealership.  Once inside he decides to buy a:'
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: true,
            index: false,
            redirectToSlash: true
        }
    }
});




server.route({
    method: 'GET',
    path: '/page2/{played*}',
    handler: function (request, reply) {

        var played = encodeURIComponent(request.params.played);
        var message = "the " + played;


        reply.view('page2', {
            title: "Buying A Car: An Odyssey",
            message: message,
            pic: played,
            nav: [
                    {
                        url: "/page3/goaway",
                        title: "She tells him to go away"
                    },
                    {
                        url: "/page3/stealscar",
                        title: "She steals his vehicle"
                    },
                    {
                        url: "/page3/drivesaway",
                        title: "She ignores him and drives off in her own car."
                    }
                ]

        });
    }
});


server.route({
    method: 'GET',
    path: '/page3/{played*}',
    handler: function (request, reply) {
         var played = encodeURIComponent(request.params.played);
        var message = "He heads back to the dealership because apparently he needs a better car!" ;
        reply.view('page3', {
            title: "Buying A Car: An Odyssey",
            message: message,
            pic: played

        });
    }
});

server.route({
    method: 'GET',
    path: '/basicHandler',
    handler: {
        view:{
            template: 'basic',
            context: {
               title: "Basic Handler",
                message: "More information"
            }

        }
    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

});
