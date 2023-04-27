const expect = require('chai')


describe('Arrays', () => {
    describe('#sort', () => {
        it('Sorting names array',() => {
            var names = ['Dani','Sdi','Adam'];
            expect(names.sort()).to.be.eql(['Adam','Dani','Sdi']);
        })
    })
})
