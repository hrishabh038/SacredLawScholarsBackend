import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email_address: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model("User", UserSchema);

export default User;
