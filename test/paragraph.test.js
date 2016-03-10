describe('my awesome website', function() {

    before(function() {
        var chai = require('chai');
        var chaiAsPromised = require('chai-as-promised');
        chai.use(chaiAsPromised);
        expect = chai.expect;
        chai.Should();
    });

    it('should do some chai assertions', function() {
        return browser
            .url('/index.html')
            .getTitle().should.eventually.be.equal('');
    });
});