const mongoose = require('mongoose');

const QUEUE_STATUSES = ['active', 'inactive'];

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: QUEUE_STATUSES,
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

queueSchema.index({ name: 1 }, { unique: true });
queueSchema.index({ status: 1, createdAt: -1 }, { name: 'idx_queue_status_createdAt' });

const Queue = mongoose.model('Queue', queueSchema);

module.exports = {
  Queue,
  QUEUE_STATUSES,
};
