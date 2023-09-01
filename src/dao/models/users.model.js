import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  age: { type: Number, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  cart: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts",
      },
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const User = mongoose.model(userCollection, userSchema);

export default User;
