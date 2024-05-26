import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import nodemailer from 'nodemailer';


export const test = (req, res) => {
    res.json({
        message: "API is working"
    })
}


export const getAllProperties = async (req, res, next) => {

    try {
        const userData = await User.find({});
        if (!userData) {
        
            return next(errorHandler(404, "User not found"));
        }
        const products = [];
        userData.map((user) => {
            products.push(user.products);
            console.log(user)
        });
        console.log(products)
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

export const getProperties = async (req, res, next) => {
    // if (req.user.id !== req.params.id) {
    //     return next(errorHandler(401, "You can get only your account details"));
    // }
    try {
        const userData = await User.findById(req.params.id);
        if (!userData) {
            return next(errorHandler(404, "User not found"));
        }

        const { products } = userData._doc;
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}


export const getSellerInfo = async (req, res, next) => {
    // if (req.body.sellerId !== req.params.id) {
    //     return next(errorHandler(401, "You can update only your account"));
    // }

    try {
        const user = await User.findOne(
            { "products.data.uniqueId": req.params.uniqueId }
        );
        console.log("Backend", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { email, phoneNumber } = user;
        res.status(200).json({ email, phoneNumber });
    } catch (error) {
        console.log("Backend Failure", error);
        next(error);
    }
}

// ------------------------------------------email sending starts-----------------------------------------------
export const sendEmail = async (req, res, next) => {
    const auth = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: `${process.env.MY_EMAIL}`,
            pass: `${process.env.MY_EMAIL_PASSWORD}`
        }
    });

    const receiver = {
        from: `${process.env.MY_EMAIL}`,
        to: req.body.buyerEmail,
        subject: 'Contact details of the property owner || Rentify private limited',
        text: `Mobile number of seller: ${req.body.buyerMob}`
    };

    auth.sendMail(receiver, (error, emailResponse) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Success!');
        // res.json('Email sent successfully');
    });







    const auth2 = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: `${process.env.MY_EMAIL}`,
            pass: `${process.env.MY_EMAIL_PASSWORD}`
        }
    });

    const receiver2 = {
        from: `${process.env.MY_EMAIL}`,
        to: req.body.sellerEmail,
        subject: 'There is a customer shown interest in your product || Rentify private limited',
        text: `Mobile number of customer: ${req.body.sellerMob}`
    };

    auth2.sendMail(receiver2, (error, emailResponse) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Success!');
        res.json('Email sent successfully');
    });
}
// ------------------------------------------email sending ends-----------------------------------------------


// -----------------------------------------Update User Starts---------------------------------------------------------------

export const updateUser = async (req, res, next) => {
    // koi khudke account se dusre ka account delete na kr paaye
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        // agr password khali nhi h kewal tbhi password update karo
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture
                }
            },
            {
                new: true
            }
        );

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

// -----------------------------------------Update User Ends---------------------------------------------------------------



// -----------------------------------------Update User Property Starts---------------------------------------------------------------

export const updateUserProperty = async (req, res, next) => {
    // koi khudke account se dusre ka account delete na kr paaye
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        // agr password khali nhi h kewal tbhi password update karo
        const user = await User.findByIdAndUpdate(req.params.id,
            { $set: { products: req.body.products } },
            { new: true, useFindAndModify: false }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


export const updateLikes = async (req, res, next) => {
    if (req.body.sellerId !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        const user = await User.updateOne(
            { "products.data.uniqueId": req.body.uniqueId },
            { $set: { "products.$.data.likes": req.body.newLikes } },
            { new: true, useFindAndModify: false }
        );
        console.log("Backend", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Backend Failure", error);
        next(error);
    }
}


export const updateMyLikedProperties = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            { $set: { likedProperties: req.body.likedProperties } },
            { new: true, useFindAndModify: false }
        );

        console.log("Backend", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Backend Failure", error);
        next(error);
    }
}

// -----------------------------------------Update User Property Ends---------------------------------------------------------------




// -----------------------------------------Delete User Starts---------------------------------------------------------------

export const deleteUser = async (req, res, next) => {
    if (req.body.id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your account"))
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (error) {
        next(error);
    }
}

// -----------------------------------------Delete User Ends---------------------------------------------------------------

