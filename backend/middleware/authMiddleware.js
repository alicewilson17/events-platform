const jwt = require('jsonwebtoken')

//middleware to verify the JWT token

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] //get token from header
    if(!token) {
        return res.status(401).json({msg: 'No token provided. Authorisation denied.'})
    }

    try {
const decoded = jwt.verify(token, process.env.JWT_SECRET) //secret that was used during signup/login
req.user = decoded // attach the decoded user info to the request object
next() //proceed to next middleware or route handler
    }
    catch(error) {
        console.error('JWT error:', error)
        res.status(401).json({msg: 'Invalid token. Authorisation denied.'})
    }
}


//middleware to verify if user is an admin
exports.adminOnly = (req,res,next) => {
    if (!req.user) {
return res.status(401).json({msg: 'Unauthorised'})
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({msg: 'Access denied. Admins only.'})
    }
    next() //if user is authenticated and is an admin, proceed to the next middleware/route
}