import validator from 'validator';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    console.log("new Created Token is : " + jwt.sign({ id }, process.env.JWT_SECRET))
    return jwt.sign({ id }, process.env.JWT_SECRET);
}


// route for user login 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't Exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } });

        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // checking user already exists or not 
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        // validatin email format and strogn password 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please enter valid email" });

        }
        if (password.length < 8) {
            return res.json({ success: false, message: "please enter strong password" });

        }

        // /hasing user password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()


        const token = createToken(user._id);
        res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email } })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Route for admin login  
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credential" })
        }

    }
    catch (error) {
        console.log(error);
        res.json({ success: true, message: error })
    }
}

// Google OAuth authentication
const googleAuth = async (req, res) => {
    try {
        const { name, email, picture, googleId } = req.body;

        console.log('Google Auth Request:', { name, email, picture, googleId });

        if (!email || !googleId) {
            return res.status(400).json({
                success: false,
                message: 'Google authentication data is incomplete'
            });
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });

        if (user) {
            // User exists, check if they have Google ID
            if (!user.googleId) {
                // Add Google ID to existing user
                user.googleId = googleId;
                user.isGoogleUser = true;
                if (picture) user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Create new user with Google data
            user = new userModel({
                name: name || email.split('@')[0],
                email: email,
                googleId: googleId,
                password: '', // No password for Google users
                profilePicture: picture || '',
                isGoogleUser: true
            });
            await user.save();
        }

        // Generate JWT token
        const token = createToken(user._id);

        console.log('Google Auth Success:', { userId: user._id, email: user.email });

        res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || picture
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed: ' + error.message
        });
    }
};

export { loginUser, registerUser, adminLogin, googleAuth };