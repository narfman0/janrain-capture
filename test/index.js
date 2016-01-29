var should = require('chai').should(),
    module = require('../js/index');

describe('#merge_objects', function() {
    it('Merges two javascript objects, creating a new object', function() {
        var obj1 = {
            key1: 'value1',
            key2: 'value2',
            key4: 'value4',
        };
        var obj2 = {
            key2: 'value2_2',
            key3: 'value3_2',
        };
        var objResult = module.merge_objects(obj1, obj2);
        objResult.key1.should.equal('value1');
        objResult.key2.should.equal('value2_2');
        objResult.key3.should.equal('value3_2');
        objResult.key4.should.equal('value4');
    });
});
