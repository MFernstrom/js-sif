const assert = require('assert')
const sif = require('../sif')

describe('Good SQL test', function () {
    const results = sif.scanDirectory(process.cwd() + '\\test\\testtargets\\goodsql')
    it('should not have found any problems', function () {
        assert.equal(results.foundErrors, false);
    });

    it('should have a single entry', function () {
        assert.equal(results.files.length, 1);
    });

    it('should be "sql.js"', function(){
        assert.equal(results.files[0]['path'], 'sql.js')
    })

    it('sql.js should have no problems in listed in array', function(){
        assert.equal(results.files[0].errors.length, 0)
    })
});


describe('Bad SQL test', function () {
    const results = sif.scanDirectory(process.cwd() + '\\test\\testtargets\\badsql')

    it('should have found risky SQL', function () {
        assert.equal(results.foundErrors, true);
    });

    it('should have two entries', function () {
        assert.equal(results.files.length, 2);
    });

    it('should be "concatenation.js" and "stringliteral.js"', function () {
        assert.equal(results.files.filter(file => file.path === "concatenation.js").length, 1);
        assert.equal(results.files.filter(file => file.path === "stringliteral.js").length, 1);
    });

    it('stringliteral.js should have risky SQL', function () {
        assert.equal(results.files.filter(file => file.path === 'stringliteral.js')[0]['errors'].length, 1);
    });

    it('concatenation.js should have risky SQL', function () {
        assert.equal(results.files.filter(file => file.path === "concatenation.js")[0]['errors'].length, 1);
    });
});