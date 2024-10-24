const { fetchSignupsByUser, fetchAdminEventsWithSignups } = require("../models/userModel")

exports.getSignUpsByUser = async (req,res,next) => {

    const {userId} = req.user //extract user info from auth middleware
    const requestedUserId = req.params.user_id //get user id from route params


    try {
      //check if the logged in user is trying to access their own signups
         if (userId != requestedUserId) {
             return res.status(403).json({msg: 'Access denied.'})
          }

          const signUps = await fetchSignupsByUser(requestedUserId)
          
          // check if there are no signups and return an empty array
            if (signUps.length === 0) {
             return res.status(200).json({ signUps: [] });
         }
res.status(200).send({signUps})
     }
     catch(error) {
        next(error)
     }

}

exports.getAdminEvents = async (req,res,next) => {
   const {userId} = req.user
   try {
      const adminEvents = await fetchAdminEventsWithSignups(userId)

      if(adminEvents.length === 0) {
         res.status(404).json({message: "No events found for this admin."})
      }
      res.status(200).json({adminEvents})
   }
   catch(error) {
     next(error)
   }
}