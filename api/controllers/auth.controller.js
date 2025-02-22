import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export const register = async (req , res)=>{
    try {
        const {username, email, password} = req.body

    //Hash the password
    const hashedPassword = await argon2.hash(password, 10)

    // Created a new user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })

    res.status(201).json({
        isSuccess: true,
        message: "User successfully created!"
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message: "Something went wrong!"
        })
    }
}

export const login = async (req , res)=>{
    try {
        const {username, password} = req.body


        //CHECK IF THE USER EXCISTED

        const user = await prisma.user.findUnique({
            where: {username}
        })
         
        if(!user){
            res.status(401).json({
                isSuccess: false,
                message: "Inviled Credentials!"
            })

            return
        }
         

        // CHECK THE PASSWORD
        if(!user.password.startsWith("$argon2")) {
            res.status(500).json({
                isSuccess: false,
                message: "Stored password is not a valid Argon2 hash"
            })

            return
        }
        const isPasswordValid = await argon2.verify(user.password, password)

        if(!isPasswordValid){
            res.status(401).json({
                isSuccess: false,
                message: "Inviled Credentials!"
            })

            return
        }
        
        // MADE A TOKEN FOR THE USER
        const age = 1000 * 60 * 60 * 24 * 7

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY,
         {expiresIn: age})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({
            isSuccess: true,
            message: "login successfully!"
        })

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccess: false,
            message: "Something went wrong!"
        })
    }
}

export const logout = (req , res)=>{
    res.clearCookie("token").status(200).json({
        isSuccess: true,
        message: "Log out successfully!"
    })
}