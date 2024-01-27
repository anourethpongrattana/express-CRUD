const router = require("express").Router();
const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/requireAuth");
const bcrypt = require("bcrypt");

const User = require("../models/Users.model");

// 1. Create User

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1. Method directly on route
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({ email, password: hashedPassword });
    // res.status(201).json({ message: "User created", data: createdUser });

    // 2. Method with pre save Model
    // ***Create User with save sequence needed
    // const createdUser = new User({ email, password });
    // ***Save the user and lauch pre("save")of Users.model.js
    // await createdUser.save();

    // Create token to send to front
    const token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "User created", token: token });
  } catch (err) {
    next(err);
  }
});

// 2. Read User
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const users = await User.find().select({ email: 1 });
    res.status(201).json({ message: "all users are get", data: users });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select({ email: 1 });
    res.status(201).json({
      message: `User with id: ${id} was successfully found`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

// 3. Update User
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { email, password } = req.body;
  const updatedUser = { email, password };
  try {
    const user = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
    });
    res.status(201).json({ message: "User updated", email: updatedUser.email });
  } catch (error) {
    next(error);
  }
});

// 4. Delete user
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(201).json({ message: `user ${user.email} is deleted` });
  } catch (error) {
    next(error);
  }
});

// 5. Log User
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // const user = await User.findOne({ email }).orFail();
    // If .orFail() missing, add throw error

    const user = await User.findOne({ email });
    if (user === null) {
      throw new Error("Authentication failed");
    }

    // 1. Directly compare on route
    const comparePassword = bcrypt.compareSync(password, user.password);
    console.log("comparePassword : ", comparePassword);
    if (!comparePassword) {
      throw new Error("Authentication failed");
    }

    // 2. With compare password on model
    // await user.comparePassword(password);

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User sign in", token: token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
