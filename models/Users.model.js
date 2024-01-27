const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is mandatory"],
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: "Invalid email address format",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// userSchema.pre("save", function (next) {
//   bcrypt.genSalt((err, salt) => {
//     if (err) {
//       return next(err);
//     }

//     bcrypt.hash(this.password, salt, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       console.log(hash);

//       this.password = hash;
//       next();
//     });
//   });
// });

// userSchema.methods.comparePassword = function (candidatePassword) {
//   console.log(this.password);
//   console.log(candidatePassword);

//   return new Promise((resolve, reject) => {
//     bcrypt.compare(candidatePassword, this.password, (err, isMatch) =>{
//       if (err) {
//         reject(err)
//       }

//       if (isMatch) {
//         resolve(true)
//       } else {
//         reject("Authentication failed")
//       }
//     })
//   })
// };

const User = model("User", userSchema);
module.exports = User;
