const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: true,
      index: true,
    },
    serviceDate: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    nextTokenNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

sequenceSchema.index(
  { queueId: 1, serviceDate: 1 },
  { unique: true, name: 'uq_queue_sequence_per_day' },
);

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = {
  Sequence,
};
