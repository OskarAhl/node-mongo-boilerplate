const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'user123';
// Hashing - obfuscate the password
// One way algorithm - can't get original password back
const hash = SHA256(password).toString();

// data to send from server to client
const data = {
    // users _id
    id: 4
};

const token = {
    data,
    // hashed value of the data
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// user could change data id to 5 and hash data
// would fool our system
// How to prevent? Salt the hash
// add smt unique on to the hash that changes the value
// e.g. add random value on hash 
//  ==> add 'secret' to end to salt with
// secret is only on server
const resultHash = SHA256(JSON.stringify(token.data)+ 'somesecret').toString();

if (resultHash === token.hash) {
    console.log(resultHash);
    console.log(token.hash);
    console.log('we have a match! Data was not changed');
} else {
    console.log('data changed - dont trust');
}

//  Why ? to make sure data is not changed / manipulated - i.e. man in the middle attack
// ***************** Standard ====> JWT ******************************

// takes object and signs it - adds hash (w/ secret) and returns token value
// jwt.sign

// takes token + secret and verifies that it hasn't been tampered with
// jwt.verify

var datanew = {
    id: 10
};

const jwtToken = jwt.sign(datanew, 'secrethere');
// send back to user when login
console.log('jwtToken', jwtToken);

const decoded = jwt.verify(jwtToken, 'secrethere');
console.log(decoded);


// BCRYPT For password hashing
const passwordBcrypt = '123abc';
//  Bcrypt has built in hash
// 1: nr of rounds - takes longer -> harder for bruteforce,
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('hash', hash);
    });
});

// bcrypt.compare(password, hashPassword, (err, res) => {
//     res --> true or false
// })