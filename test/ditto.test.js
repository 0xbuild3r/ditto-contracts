const { expectRevert } = require('@openzeppelin/test-helpers');
const Ditto = artifacts.require('Ditto');
const BN = web3.utils.BN;


contract('Ditto', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.ditto = await Ditto.new({ from: alice });
    });

    const expectedSupply  = new BN("1750000000000000");

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.ditto.name();
        const symbol = await this.ditto.symbol();
        const decimals = await this.ditto.decimals();
        assert.equal(name.valueOf(), 'Ditto');
        assert.equal(symbol.valueOf(), 'DITTO');
        assert.equal(decimals.valueOf(), '9');
    });

    it('should have correct initial supply', async () => {
        const totalSupply = await this.ditto.totalSupply();
        assert(totalSupply.eq(expectedSupply));

        const creatorBal = await this.ditto.balanceOf(alice);
        assert(creatorBal.eq(totalSupply));
    });

    it('should perform token transfers properly', async () => {
        await this.ditto.transfer(carol, '100', { from: alice });
        const carolBal = await this.ditto.balanceOf(carol);
        assert.equal(carolBal.valueOf(), '100');
    });

    it('should fail if user tries to do bad transfers', async () => {
        await expectRevert(
            this.ditto.transfer(carol, '1', { from: bob }),
            'revert'
        );
    });

    it('should revert if rebase is called and caller is not the master', async () => {
        await expectRevert(
            this.ditto.rebase('0', '0', { from: bob }),
            'revert'
        );
    });

    it('should revert if setMaster is called and caller is not the master', async () => {
        await expectRevert(
            this.ditto.setMaster(web3.utils.randomHex(20), { from: bob }),
            'revert'
        );
    });

  });
