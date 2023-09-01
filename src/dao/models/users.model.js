import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  password: { type: String, required: true, max: 100 },
  age: { type: Number, required: true, max: 100 },
});

const User = mongoose.model(userCollection, userSchema);

export default User;
