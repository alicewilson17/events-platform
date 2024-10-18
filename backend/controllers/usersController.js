const { fetchSignupsByUser } = require("../models/userModel")

exports.getSignUpsByUser = async (req,res,next) => {

    const {userId} = req.user //extract user info from auth middleware
    const requestedUserId = req.params.user_id //get user id from route params


    try {
         if (userId != requestedUserId) {
             return res.status(403).json({msg: 'Access denied.'})
          }
         const signUps = await fetchSignupsByUser(requestedUserId)

res.status(200).send({signUps})
     }
     catch(error) {
        next(error)
     }

}