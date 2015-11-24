var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,
    app = require('./app');
    db = require('./models'),

repl.context.db = db;
repl.context.app = app;
promisify(repl);