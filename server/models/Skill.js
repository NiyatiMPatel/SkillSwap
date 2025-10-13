import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a skill title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a skill description'],
      maxlength: 500,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    skillType: {
      type: String,
      enum: ['teach', 'learn'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching and filtering
skillSchema.index({ title: 'text', description: 'text', category: 'text' });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
