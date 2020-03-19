Commands to setup server:
    npm install express --save
    npm install body-parser --save
    npm install -g nodemon
    npm install mongodb
    npm install mocha chai --save-dev
    npm install forever -g
    npm install forever-monitor
    //**FUTURE**: npm install --save-dev mocha-each

Manually Install:
    **install mongodb with compass
        MONGODB SETUP: start a mongodb server running on localhost:27017

HOW TO START SERVER
    forever start -c "node" .\server.js

HOW TO STOP SERVER
    forever stopall

