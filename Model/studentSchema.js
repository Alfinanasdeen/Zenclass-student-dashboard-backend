import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add first name'],
  },
  lName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  batch: {
    type: String,
    default: 'B47-WD2 Tamil',
  },
  contactNo: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please add the email address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
  },
  resetToken: {
    type: String,
    default: '',
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  codeKata: {
    type: String,
    default: '0',
  },
  webKata: {
    type: String,
    default: '0',
  },
  mockInterview: {
    type: String,
    default: '0',
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  leave: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leave',
  }],
  portfolio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
  }],
  capstone: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Capstone',
  }],
  webcode: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webcode',
  }],
  query: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Query',
  }],
  mock: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mock',
  }],
  task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
