import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  designation: { type: String, required: true, enum: ['super admin', 'senior engineer', 'junior engineer', 'temporary employee'] },
  assignedProject: { type: String, required: false },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

export default User;
