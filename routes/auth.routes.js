const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/auth.models");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const uuid = require('uuid');
const path = require("path")
require("dotenv").config();
const router = express.Router();


// CODE FOR SENDING MAIL TO THE USER
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const gmailUser = process.env.GMAIL_USER;
const Refresh_Token = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uri
);
oAuth2Client.setCredentials({ refresh_token: Refresh_Token });


// signup: POST (public)
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Please select your role").not().isEmpty(),
    check("branch", "Please select your branch").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, branch, role } = req.body;

    try {
      let user = await User.findOne({ email });

      // check if user already exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Generate a verification token (UUID)
      const verificationToken = uuid.v4();

      // hashing passwords
      const salt = await bcrypt.genSalt(12);
      const encryptedpassword = await bcrypt.hash(password, salt);

      // make user account
      user = new User({
        name,
        email,
        password: encryptedpassword,
        branch,
        role,
        isAdmin: false,
        emailVerificationToken: verificationToken, // Store the verification token
        isVerified: false, // Initialize as not verified
      });
      await user.save();

      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: gmailUser,
          clientId: client_id,
          clientSecret: client_secret,
          refreshToken: Refresh_Token,
          accessToken: accessToken,
        },
      });
      
      const verificationLink = `http://localhost:5000/verify/${verificationToken}`
      // Send the verification link to the user's email
      const mailOptions = {
        from: "kjsitcanteen@gmail.com",
        to: email,
        subject: "E-mail Verification",
        html: `
        <p>Thank you for signing up! Please click the following link to verify your email:</p>
        <a href="${verificationLink}">Verify your E-mail</a>
      `,
      };
  
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log("Error sending email: " + error);
          return res.status(500).json({ message: "Email sending failed" });
        } else {
          // console.log('Email sent: ' + info.response);
          res.json({ message: "Verification link sent to your email" });
        }
      });

      // jwt
      // const payload = {
      //   user: {
      //     id: user.id,
      //   },
      // };

      // jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      //   if (err) {
      //     throw err;
      //   }
      //   res.json({ token, user });
      // });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error);
    }
  }
);

// Create a new route for email verification
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Verification token is invalid or has expired.' });
    }

    if (user) {
      // Mark the user's email as verified
      user.isVerified = true;
      user.emailVerificationToken = null; // Clear the token to prevent reuse
      await user.save();
      return res.redirect('/verified?emailVerified=true')

    } else {
      // Handle requests from other sources or without the "source" parameter
      res.status(400).json({ message: 'Invalid request source.' });
      return res.redirect('/verified?emailVerified=false');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
    return res.redirect('/verified?emailVerified=false');
  }
});

router.get("/verified",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/src/components/email-verified/email-verified.html"))
});


//signin: POST (public)
router.post(
  "/signin",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email does not exist" }] });
      }
      else if(user.isVerified==false){
        res.json({error: [{msg:"Email is not verified!"}] });
      }

      // check password

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // JWT Token

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

//get user: GET (private)

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});



function generateEmailTemplate(otp) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: url('../frontend/public/template_img.webp') no-repeat center center fixed;
        background-size: cover;
        background-color: #f4f4f4; /* Fallback background color */
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent background color */
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
      }
      p {
        color: #666;
      }
      .otp-container {
        background-color: #007BFF;
        color: #fff;
        padding: 10px 20px;
        font-weight: bold;
        border-radius: 5px;
        text-align: center;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Cosmos Canten</h1>
      <p>OTP Verification</p>
      <div class="otp-container">
        <strong>${otp}</strong> <!-- Replace with your OTP -->
      </div>
      <p>OTP is valid for 10 minutes.</p>
    </div>
  </body>
  </html>
  `;
}

// Generate and send OTP to the user's email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the given email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpTimestamp = Date.now();

    // Store the OTP in the user's record
    user.otp = otp;
    user.otpTimestamp = otpTimestamp;
    await user.save();

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmailUser,
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: Refresh_Token,
        accessToken: accessToken,
      },
    });

    // Send the OTP to the user's email
    const mailOptions = {
      from: "kjsitcanteen@gmail.com",
      to: email,
      subject: "Reset Password OTP",
      html: generateEmailTemplate(otp),
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log("Error sending email: " + error);
        return res.status(500).json({ message: "Email sending failed" });
      } else {
        // console.log('Email sent: ' + info.response);
        res.json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP and reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user with the given email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpTimestamp = user.otpTimestamp;
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - otpTimestamp;
    const otpExpiration = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Check if the provided OTP matches the stored OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else if (timeDifference > otpExpiration) {
      return res.status(400).json({ message: "otp has expired!" });
    }

    // hashing passwords
    const salt = await bcrypt.genSalt(12);
    const encryptedpassword = await bcrypt.hash(newPassword, salt);
    user.password = encryptedpassword;

    // Clear the stored OTP
    user.otp = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
