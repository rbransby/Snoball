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
	
	describe('#isValidSolution(solution)', () => {
		let snoballGame;
		
		beforeEach(() => {
			snoballGame = new SnoballGame(2,4);
			snoballGame.Numbers = [100,25,2,3,3,6];
		});
		
		it('returns false with blank solution', () => {
			snoballGame.isValidSolution("").should.equal(false);
		});
		
		it('returns false with invalid numbers', () => {
			snoballGame.isValidSolution("100*50").should.equal(false);
		});
		
		it('returns false when valid number used invalid number of times', () => {
			snoballGame.isValidSolution("100*25+25").should.equal(false);
		});
		
		it('returns true with valid solution using ALL numbers', () => {
			snoballGame.isValidSolution("100*25+2+3+3+6").should.equal(true);
		});
		
		it('returns true with valid solution using a subset of the numbers', () => {
			snoballGame.isValidSolution("100*25+2+6").should.equal(true);
		});
		
		it('returns true with valid solution containing legitimate duplicate numbers', () => {
			snoballGame.isValidSolution("100*3*3").should.equal(true);
		});
		
		it('returns false with incorrect syntax in expression', () => {
			snoballGame.isValidSolution("pooweebum").should.equal(false);
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
});
