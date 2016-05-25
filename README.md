# Snoball

Snoball is a maths game based loosely on the SBS TV show 'Letters and Numbers' where contestants choose a combination of 6 large and 
small numbers and attempt to reach a 3 digit target using basic maths operations.

For example, I could choose 2 large and 4 small numbers and be assigned at random the following:

1, 5, 6, 3, 50, 75

and if my random target to reach is, say 564, my challenge is to use the above 6 numbers to reach that target.

A solution might be (6+5)*50 + 4 + 3 + 1 = 558.

I'd be awarded only 4 points out of a possible 10 for this solution, as I was 6 away from the target.

# Technologies

I'm using NodeJS + Express + Socket.io to serve up the game logic, and Polymer Web Components on the client. Please forgive any rookieness 
as I used this little project as a basis to learn both technologies. 

# Installation

To install, clone the repo and then:

`npm install` to pull down the node package dependencies
`bower install` to pull down the bower dependencies (mostly the web component stuff)
`node snoball-server.js` will get the server running and spin up the socket.io instance, as well as express to serve up the web client.

# Testing

I've used mocha/chai to do some basic unit/integration tests. To run the unit tests:
If not already installed, grab mocha:
`npm install -g mocha`

To run only the unit tests:

`mocha --grep @integ --invert`

To only run the integs, simply remove the `--invert` or to run everything just `mocha` will do!

In order to run the integration tests, you need a server up and running first.


`
