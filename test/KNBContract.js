const RockPaperScissors = artifacts.require("KNBContract");

contract("KNBContract", (accounts) => {
    const [host, player1, player2] = accounts;
    let contractInstance;
    const salt = web3.utils.asciiToHex("random_salt");
    const rock = 1;
    const paper = 2;
    const scissors = 3;
    const hashedChoiceRock = web3.utils.soliditySha3({type: 'uint8', value: rock}, {type: 'bytes32', value: salt});
    
    beforeEach(async () => {
        contractInstance = await RockPaperScissors.new({from: host});
    });

    it("should allow player to commit their choice", async () => {
        await contractInstance.commitChoice(hashedChoiceRock, {from: player1});

        const player = await contractInstance.players(player1);
        assert.equal(player.hashedChoice, hashedChoiceRock);
        assert.equal(player.choice.toNumber(), 0);
    });

    it("should not allow host to commit a choice", async () => {
        try {
            await contractInstance.commitChoice(hashedChoiceRock, {from: host});
            assert.fail("The host should not be able to commit a choice");
        } catch (error) {
            assert.include(error.message, "Only a player can perform this action");
        }
    });

    it("should allow player to reveal their choice", async () => {
        await contractInstance.commitChoice(hashedChoiceRock, {from: player1});
        await contractInstance.revealChoice(rock, salt, {from: player1});

        const player = await contractInstance.players(player1);
        assert.equal(player.choice.toNumber(), rock);
    });

    it("should determine the correct winner", async () => {
        await contractInstance.commitChoice(hashedChoiceRock, {from: player1});
        await contractInstance.commitChoice(web3.utils.soliditySha3({type: 'uint8', value: scissors}, {type: 'bytes32', value: salt}), {from: player2});
        
        await contractInstance.revealChoice(rock, salt, {from: player1});
        await contractInstance.revealChoice(scissors, salt, {from: player2});

        const result = await contractInstance.determineWinner(player1, player2, {from: host});

        assert.equal(result.logs[0].args.winner, player1);
    });
});
