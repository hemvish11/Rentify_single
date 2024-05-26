import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    data: {
        uniqueId: {
            type: Number,
            required: true
        },
        sellerId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        fullAddress: {
            type: String,
            required: true
        },
        area: {
            type: Number,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        hospital: {
            type: String,
            required: true
        },
        college: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        likes: {
            type: Number,
            required: true
        },
        owner: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    }
}, { _id: false })

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    seller: {
        type: Boolean,
        required: true
    },
    products: {
        type: [productSchema],
        default: []
    },
    likedProperties: {
        type: [Number],
        default: []
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;