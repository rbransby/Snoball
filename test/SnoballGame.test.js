"use strict";

let chai = require('chai'),
	path = require('path');	
	
chai.should();

let SnoballGame = require(path.join(__dirname, '..', 'SnoballGame.js'));

describe('SnoballGame', () => {
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
		
		it('returns true with valid solution', () => {
			snoballGame.isValidSolution("100*25+23+3+6").should.equal(true);
		});
		
		it('returns true with valid solution containing legitimate duplicate numbers', () => {
			snoballGame.isValidSolution("100*3*3").should.equal(true);
		});
		
		it('returns false with incorrect syntax in expression', () => {
			snoballGame.isValidSolution("pooweebum").should.equal(false);
		});
	});
});
