"use strict";
var math = require("mathjs");

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
	
	isValidSolution(solution)
	{
		var numberPattern = /\d+/g;
		var numbersUsed = solution.match( numberPattern );
		if (numbersUsed == null || numbersUsed.length == 0 || numbersUsed.length > 6)
		{
			//console.log(`not enough numbers or too many numbers: ${numbersUsed}`);
			return false;
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
				//console.log(`invalid number found ${numberUsed}`)
				isValidNumbers = false;
				return;
			}
		});
		
		if (!isValidNumbers)
		{
			//console.log("isValidNumbers == false");
			return false;
		}
		
		try {
			math.eval(solution)
		}
		catch (exception) {
			console.log(exception.message);
			return false;
		}
		
		return true;
	}
}

module.exports = SnoballGame;