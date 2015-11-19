"use strict";
var math = require("mathjs");
var logger = require('winston');

class SnoballGame
{
	// takes number of big numbers and number of small numbers as a parameter
	constructor(big, small)
	{
		if (big+small != 6)
		{
			throw new Error("Must request exactly 6 numbers in total");
		}
		
		this.Bigs = big;
		this.Smalls = small;
		this.Numbers = this.calculateNumbers(big, small);	
		this.Target = Math.floor(Math.random() * 1000);					
	}
	
	calculateNumbers(bigs, smalls) {
		let possibleBigs = [100,75,50,25];
		let possibleSmalls = [1,2,3,4,5,6,7,8,9,10];
		let numbers = [];
		
		for (let i = 0; i<bigs; i++)
		{
			numbers.push(possibleBigs[Math.floor(Math.random()*possibleBigs.length)]);
		}
		
		for (let i = 0; i<smalls; i++)
		{
			numbers.push(possibleSmalls[Math.floor(Math.random()*possibleSmalls.length)]);
		}
		
		return numbers;
	}

	// calculates the players score for the given target and solution
	// returns: {isValid: true, solution: '10*10', explanation:'', score: 10}
	calculateScore(solution) {
		let validatedSolution = this.isValidSolution(solution);
		if (validatedSolution.isValid)
		{
			let calculatedResult = math.eval(solution);
			let score = 10 - Math.abs(this.Target - calculatedResult);
			if (score < 0)
			{
				score = 0;
			}
			return {isValid: true, solution: solution, explanation:'', score:score};
		}
		else
		{
			return {isValid: false, solution: solution, explanation: validatedSolution.reason, score:0};
		}
	}
	
	// returns: {isValid: true, reason: ''}
	isValidSolution(solution)
	{
		var numberPattern = /\d+/g;
		var numbersUsed = solution.match( numberPattern );
		if (numbersUsed == null || numbersUsed.length == 0 || numbersUsed.length > 6)
		{
			//logger.info(`not enough numbers or too many numbers: ${numbersUsed}`);
			return {isValid: false, reason: 'No numbers or too many numbers in solution'};
		}
		
		// convert the array of stringified digits to ints
		numbersUsed = numbersUsed.map((item) => {return +item;})
		
		let gameNumbers = this.Numbers.slice(0);
		
		var isValidNumbers = true;
		numbersUsed.forEach(function (numberUsed){
			if (gameNumbers.indexOf(numberUsed) > -1)
			{
				gameNumbers.splice(gameNumbers.indexOf(numberUsed),1);
			}
			else
			{
				//logger.info(`invalid number found ${numberUsed}`)
				isValidNumbers = false;
				return;
			}
		});
		
		if (!isValidNumbers)
		{
			//logger.info("isValidNumbers == false");
			return {isValid: false, reason: 'Invalid number used in solution'};
		}
		
		try {
			math.eval(solution)
		}
		catch (exception) {
			logger.info(exception.message);
			return {isValid: false, reason: 'Invalid mathematical syntax was used'};
		}
		
		return {isValid: true, reason: ''};
	}
	
	// returns: [{isValid: true, solution: '10*10', explanation:'', score: 10}]
	completeGame(playerSolutions)
	{
		let completedGameResults = [];
		for (var playerSolution of playerSolutions)
		{
			completedGameResults.push({playerName: playerSolution.playerName, solution: this.calculateScore(playerSolution.solution)});
		}
		
		return completedGameResults;
	}
}

module.exports = SnoballGame;