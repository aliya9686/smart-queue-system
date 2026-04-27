const mongoose = require('mongoose');

const COUNTER_STATUSES = ['active', 'inactive'];

const counterSchema = new mongoose.Schema(
  {
    counterNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    name: {
      type: String,
      trim: true,
      default: '',
      maxlength: 100,
    },
    assignedQueueIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Queue',
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: COUNTER_STATUSES,
      default: 'active',
      index: true,
    },
    currentTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

counterSchema.index({ counterNumber: 1 }, { unique: true });
counterSchema.index(
  { status: 1, assignedQueueIds: 1 },
  { name: 'idx_counter_status_assigned_queues' },
);
counterSchema.index(
  { currentTokenId: 1 },
  { sparse: true, unique: true, name: 'idx_current_token' },
);

const Counter = mongoose.model('Counter', counterSchema);

module.exports = {
  Counter,
  COUNTER_STATUSES,
};
