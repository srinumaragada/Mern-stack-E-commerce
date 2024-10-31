const express=require("express")
const { registerUser,loginUser ,logoutUser, AuthMiddleWare} = require("../../controllers/auth/authController")
const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)
router.get('/checkAuth',AuthMiddleWare,(req,res)=>{
            const user=req.user
            res.status(200).json({
                success:true,
                message:"Authenticated User",
                user
            })
})
module.exports=router