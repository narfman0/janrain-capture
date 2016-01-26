var should = require('chai').should(),
    module = require('../src/index');

describe('#init', function() {
    it('print hello world', function() {
        module.hello().should.equal('Hello, world!');
    });
});
