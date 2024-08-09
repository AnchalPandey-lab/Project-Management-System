import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDescription: { type: String },
  startDate: { type: String, required: true },
  district: { type: String, required: true },
  area: { type: String, required: true },
  pinCode: { type: String, required: true },
  measurementBook: { type: String },
  seniorEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  juniorEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
  status: { type: String, default: 'not started' },
  projectId: { type: String, unique: true, required: true }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
