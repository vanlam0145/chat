
const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependecies = [
    ['_', 'lodash'],
    ['mongoose', 'mongoose'],
    ['passport', 'passport'],
    ['validator', 'validator'],
    ['formidable', 'formidable'],
    ['Club', './models/clubs'],
    ['Users', './models/user'],
    ['async', 'async'],
];
simpleDependecies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    })
});
container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('controllers', function () {
    return container;
});

module.exports = container;