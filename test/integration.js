const KNBContract = artifacts.require("KNBContract");
const ScoresContract = artifacts.require("ScoresContract");

contract("Integration test", (accounts) => {
    const [host, player1, player2] = accounts;
    let contractInstance;
    let scoresInstance;
    const salt1 = web3.utils.asciiToHex("random_salt1");
    const salt2 = web3.utils.asciiToHex("random_salt2");
    const rock = 1;
    const paper = 2;
    const scissors = 3;
    const hashedChoiceRock = web3.utils.soliditySha3({type: 'uint8', value: rock}, {type: 'bytes32', value: salt1});
    const hashedChoiceScissor = web3.utils.soliditySha3({type: 'uint8', value: scissors}, {type: 'bytes32', value: salt2});
    
    beforeEach(async () => {
        contractInstance = await KNBContract.new({from: host});
        scoresInstance = await ScoresContract.new(contractInstance.address);
    });

    it("scores should be correct", async () => {
        await contractInstance.commitChoice(hashedChoiceRock, {from: player1});
        await contractInstance.commitChoice(hashedChoiceScissor, {from: player2});
        
        await contractInstance.revealChoice(rock, salt1, {from: player1});
        await contractInstance.revealChoice(scissors, salt2, {from: player2});

        const result = await contractInstance.determineWinner(player1, player2, {from: host});
        await scoresInstance.updateScores(player1, player2);
        assert.equal(scoresInstance.getScore(player1), 1);
    });
});


