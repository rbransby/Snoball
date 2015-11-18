"use strict";

let chai = require('chai'),
	path = require('path');	
	
chai.should();

let SnoballGame = require(path.join(__dirname, '..', 'SnoballGame.js'));

// returns an object describing the given snoball game numbers e.g. {bigs:2, smalls: 4}
function calculateSnoballGameNumberTypes(numbers)
{
	let validBigs = [25,50,75,100];
	let validSmalls = [1,2,3,4,5,6,7,8,9,10];
	
	let bigCount = 0
	let smallCount = 0;

	numbers.forEach((item) => {
		if (validBigs.indexOf(item) > -1)
		{
			bigCount++;
		}
		else if (validSmalls.indexOf(item) > -1)
		{
			smallCount++;
		}
	});
	
	return {bigs: bigCount, smalls: smallCount};
}

describe('SnoballGame', () => {
	describe('#constructor', () => {
		let snoballGame;
		
		beforeEach(() => {
			snoballGame = new SnoballGame(2,4);			
		});
		
		it('throws an error if bigs+smalls != 6', () => {
			() => {let s = new SnoballGame(1,3);}.should.Throw(Error);
		});
		
		it('does not throw an error if bigs+smalls == 6', () => {
			() => {let s = new SnoballGame(2,4);}.should.not.Throw(Error);
		});
	});
	
	describe('#calculateScore(solution)', () => {
		let snoballGame;
		
		beforeEach(() => {
			snoballGame = new SnoballGame(2,4);
			snoballGame.Numbers = [100,25,2,3,3,6];
			snoballGame.Target = 400;
		});
		
		it('should return a score when an exact valid solution proposed', () => {
			let result = snoballGame.calculateScore("(6-2)*100");
			result.isValid.should.equal(true);
			result.explanation.should.equal('');
			result.score.should.equal(10);
			result.solution.should.equal("(6-2)*100");			
		});
		
		it('should return a score when a slightly off but valid solution proposed', () => {
			let result = snoballGame.calculateScore("(6-2)*100+3");
			result.isValid.should.equal(true);
			result.explanation.should.equal('');
			result.score.should.equal(7);
			result.solution.should.equal("(6-2)*100+3");	
		});
		
		it('should return a score of 0 when a long way off but valid solution proposed', () => {
			let result = snoballGame.calculateScore("(6-2)*100+25");
			result.isValid.should.equal(true);
			result.explanation.should.equal('');
			result.score.should.equal(0);
			result.solution.should.equal("(6-2)*100+25");	
		});
		
		it('should return invalid with an explanation when an invalid solution proposed (invalid number)', () => {
			let result = snoballGame.calculateScore("(6-2)*100+25+7");
			result.isValid.should.equal(false);
			result.explanation.should.not.equal('');
			result.score.should.equal(0);
			result.solution.should.equal("(6-2)*100+25+7");
		});
		
		it('should return invalid with an explanation when an invalid solution proposed (too many numbers)', () => {
			let result = snoballGame.calculateScore("100+25+2+3+3+6+6");
			result.isValid.should.equal(false);
			result.explanation.should.not.equal('');
			result.score.should.equal(0);
			result.solution.should.equal("100+25+2+3+3+6+6");
		});
		
		it('should return invalid with an explanation when an invalid solution proposed (no numbers)', () => {
			let result = snoballGame.calculateScore("poobumwee");
			result.isValid.should.equal(false);
			result.explanation.should.not.equal('');
			result.score.should.equal(0);
			result.solution.should.equal("poobumwee");
		});
		
		it('should return invalid with an explanation when an invalid solution proposed (bad syntax)', () => {
			let result = snoballGame.calculateScore("10 times 10");
			result.isValid.should.equal(false);
			result.explanation.should.not.equal('');
			result.score.should.equal(0);
			result.solution.should.equal("10 times 10");
		});
		
	});
	
	describe('#isValidSolution(solution)', () => {
		let snoballGame;
		
		beforeEach(() => {
			snoballGame = new SnoballGame(2,4);
			snoballGame.Numbers = [100,25,2,3,3,6];
		});
		
		it('returns false with blank solution', () => {
			snoballGame.isValidSolution("").isValid.should.equal(false);
		});
		
		it('returns false with invalid numbers', () => {
			snoballGame.isValidSolution("100*50").isValid.should.equal(false);
		});
		
		it('returns false when valid number used invalid number of times', () => {
			snoballGame.isValidSolution("100*25+25").isValid.should.equal(false);
		});
		
		it('returns true with valid solution using ALL numbers', () => {
			snoballGame.isValidSolution("100*25+2+3+3+6").isValid.should.equal(true);
		});
		
		it('returns true with valid solution using a subset of the numbers', () => {
			snoballGame.isValidSolution("100*25+2+6").isValid.should.equal(true);
		});
		
		it('returns true with valid solution containing legitimate duplicate numbers', () => {
			snoballGame.isValidSolution("100*3*3").isValid.should.equal(true);
		});
		
		it('returns false with incorrect syntax in expression', () => {
			snoballGame.isValidSolution("pooweebum").isValid.should.equal(false);
		});
	});
	
	describe('#calculateNumbers(bigs, smalls)', () => {
		let snoballGame = new SnoballGame(2,4);;		
		
		it('should return valid snoball game numbers {1 bigs, 2 smalls}', () => {
			let numberTypes = calculateSnoballGameNumberTypes(snoballGame.calculateNumbers(1,2));
			numberTypes.bigs.should.equal(1);
			numberTypes.smalls.should.equal(2);
		});
		
		it('should return valid snoball game numbers {2 bigs, 4 smalls}', () => {
			let numberTypes = calculateSnoballGameNumberTypes(snoballGame.calculateNumbers(2,4));
			numberTypes.bigs.should.equal(2);
			numberTypes.smalls.should.equal(4);
		});
		
		it('should return valid snoball game numbers {0 bigs, 6 smalls}', () => {
			let numberTypes = calculateSnoballGameNumberTypes(snoballGame.calculateNumbers(0,6));
			numberTypes.bigs.should.equal(0);
			numberTypes.smalls.should.equal(6);
		});
		
		it('should return valid snoball game numbers {6 bigs, 0 smalls}', () => {
			let numberTypes = calculateSnoballGameNumberTypes(snoballGame.calculateNumbers(6,0));
			numberTypes.bigs.should.equal(6);
			numberTypes.smalls.should.equal(0);
		});
	});
	
	describe('#completeGame(solutions)', () => {
		let snoballGame;
		
		beforeEach(() => {
			snoballGame = new SnoballGame(2,4);
			snoballGame.Numbers = [100,25,2,3,3,6];
			snoballGame.Target = 400;
		});
		
		it('should return a set of results given a set of player solutions', () => {
			let playerSolutions = [
				{playerName: 'Player1', solution:"(6-2)*100"},
				{playerName: 'Player2', solution:"(6-2)*100+3"},
				{playerName: 'Player3', solution:"(6-2)*100+25"},
				{playerName: 'Player4', solution:"100+25+2+3+3+6+6"},
				{playerName: 'Player5', solution:"poobumwee"},
				{playerName: 'Player6', solution:"100 times 25"}
			];
			
			let results = snoballGame.completeGame(playerSolutions);
			results[0].playerName.should.equal('Player1')
			results[0].solution.isValid.should.equal(true);
			results[0].solution.score.should.equal(10);
			results[1].playerName.should.equal('Player2')
			results[1].solution.isValid.should.equal(true);
			results[1].solution.score.should.equal(7);
			results[2].playerName.should.equal('Player3')
			results[2].solution.isValid.should.equal(true);
			results[2].solution.score.should.equal(0);
			results[3].playerName.should.equal('Player4')
			results[3].solution.isValid.should.equal(false);
			results[3].solution.score.should.equal(0);
			results[3].solution.explanation.should.not.equal('');
			results[4].playerName.should.equal('Player5')
			results[4].solution.isValid.should.equal(false);
			results[4].solution.score.should.equal(0);
			results[4].solution.explanation.should.not.equal('');
			results[5].playerName.should.equal('Player6')
			results[5].solution.isValid.should.equal(false);
			results[5].solution.score.should.equal(0);
			results[5].solution.explanation.should.not.equal('');
		});
		
	});
});
