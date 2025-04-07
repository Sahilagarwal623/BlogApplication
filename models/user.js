const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/user.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }

}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;
    
    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword; 

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    
    const user = await this.findOne({email});
    if (!user)
    {
        throw new Error("User not found");
    }    

    const hashedPassword = user.password;
    const salt = user.salt;
    const providedPassHash = createHmac('sha256', salt).update(password).digest("hex");
 
    if (hashedPassword !== providedPassHash)
    {
        throw new Error("Incorrect Password");
    }

    const token = createTokenForUser(user);
    return token;

})

const User = model("user", userSchema);

module.exports = User;