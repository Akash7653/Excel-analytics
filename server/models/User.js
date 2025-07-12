import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
    status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active' // All new users will be active by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Only these values are allowed
    default: 'user' // Default role is 'user'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);