const jwt = require("jsonwebtoken")
const User = require("../models/User")


exports.auth = async (req,res, next) => {

    try {
        
        const token = req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invaild token."
            })
        } 
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in validating token"
        })
    }
}

const authorizeRole = (role, options = {}) => {
    return async (req, res, next) => {
        try {
            const userDetails = await User.findById(req.user.id);

            if (!userDetails) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            if (userDetails.accountType !== role) {
                return res.status(401).json({
                    success: false,
                    message: `This is a protected route for ${role}${role === "Admin" ? "" : "s"} only`,
                });
            }

            if (options.requireApproved && !userDetails.approved) {
                return res.status(403).json({
                    success: false,
                    message: "Your instructor account is not approved yet. Please wait for admin approval.",
                });
            }

            req.user.accountType = userDetails.accountType;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "User role cannot be verified, please try again"
            })
        }
    };
};

exports.isStudent = authorizeRole("Student")
exports.isInstructor = authorizeRole("Instructor", { requireApproved: true })

exports.isAdmin = authorizeRole("Admin")
