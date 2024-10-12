const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') // for token generation
const {getUserByEmail, createUser} = require('../models/userModel')

//sign up

exports.signUp = async (req, res) => {
    const {first_name, last_name, email, password, role} = req.body
try {
    //check if user already exists
const existingUser = await getUserByEmail(email)
if (existingUser) {
    return res.status(400).json({msg: 'User already exists'})
}

//hash the password
const hashedPassword = await bcrypt.hash(password, 10)

//create a new user
const newUser = await createUser(first_name, last_name, email, hashedPassword, role)

//Respond with the new user's data (exc password)

res.status(201).json({
    user: {
        user_id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
    }
})
}
catch (error){
console.error(error)
res.status(500).json({msg: 'server error'})
}
}

//log in
exports.logIn = async (req,res) => {
    const {email, password} = req.body
    try {
//find the user by their email
const user = await getUserByEmail(email)
if(!user) {
    return res.status(400).json({msg: "Invalid credentials."})
}
//Compare the password with the stored hash
const passwordsMatch = await bcrypt.compare(password, user.password)
if(!passwordsMatch) {
    return res.status(400).json({msg: "Invalid credentials."})
}

//Generate JWT token
const token = jwt.sign({ userId: user.user_id, role: user.role}, // payload
    process.env.JWT_SECRET, //secure secret key, from env variable
    {expiresIn: '1h'} // token expiration time)
)

//respond with the token and user info
res.status(200).json({
    token,
    user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    }
})
    }
    catch (error){
        console.error(error)
        res.status(500).json({msg: 'server error'})
        }
}