var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
expect = chai.expect;
chai.Should();

describe('line-height calculation', function() {

    it('should compute the right line-height', function(done) {
        return browser
            .windowHandleSize({width:1024,height:768})
            .url('/index.html')
            .getCssProperty('.paragraph', 'line-height', function(err, elements) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].value.should.equal('36px');
                }
            })
            .windowHandleSize({width:320,height:480})
            .getCssProperty('.paragraph', 'line-height', function(err, elements) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].value.should.equal('24px');
                }
            }).call(done);
    });

});

describe('margin calculation', function() {

    it('should space paragraphs at integer multiples of the root size', function(done) {
        return browser
            .windowHandleSize({width:1024,height:768})
            .url('/index.html')
            .moveToObject('#culprit')
            .execute('offsetPseudo(\'culprit\', \':before\')')
            .then(function(result) {
                var lineheight = 18;
                var y = result.value * 1.0 / lineheight;
                y.should.equal(Math.floor(y));
            }).call(done);
    });

});
