import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



// -----------------------------------Sign up Functionality starts-------------------------------------------------------------------------

export const signup = async (req, res, next) => {
    const { firstName,lastName, email,phoneNumber,seller, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ firstName,lastName,email,phoneNumber,seller, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}
// -----------------------------------Sign up Functionality ends-------------------------------------------------------------------------





// -----------------------------------Sign In Functionality starts-------------------------------------------------------------------------

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials"))
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        const { password: hashedPassword, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 36000000);
        res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: expiryDate
            })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error)
    }
}

// -----------------------------------Sign In Functionality ends-------------------------------------------------------------------------






// -----------------------------------Sign out Functionality starts-------------------------------------------------------------------------

export const signout = (req, res) => {
    res
        .clearCookie("access_token")
        .status(200)
        .json("Signout success");
}

// -----------------------------------Sign out Functionality Ends-------------------------------------------------------------------------
