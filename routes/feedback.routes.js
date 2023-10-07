const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Form = require('../models/feedback.models')
const Users = require("../models/auth.models")
const router = express.Router();


router.post('/feedback',auth,  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("branch", "Please select your branch").not().isEmpty(),
    check("description", "Description is required.").optional().isLength({ min: 1 })
  ],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, branch, description} = req.body;
    
    try {        
        let data = new Form({
            name,
            email,
            branch,
            description,
        });
        await data.save();
        res.json({data})
    }catch (error) {
        console.log(error.message);
        res.status(500).send(error);
      }
})

router.get("/getusers",auth, async (req,res)=>{
  try {
    const users = await Users.find({}).select("-password")
    res.json(users)
  } catch (error) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
})

router.get('/feedback', async (req, res) => {
  try {
      const feedbackData = await Form.find();
      res.json(feedbackData);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;