const bcrypt = require('bcrypt');
const saltRound = 10

const hash = async (data) => {
    const hashedData = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRound, (err, salt) => {
            bcrypt.hash(data, salt, (err, hashed)=> {
                resolve(hashed)
            })
        })
    })
    return hashedData
}

const compare = ( rawPassword, encryptedPassword ) => {
    const matched = bcrypt.compareSync(rawPassword, encryptedPassword)
    return matched
}

module.exports = {
    hash,
    compare
}