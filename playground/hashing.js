const { SHA256 } = require('crypto-js');

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
// Standard ====> JWT