const mongoose = require('mongoose');

const TOKEN_STATUSES = [
  'waiting',
  'serving',
  'completed',
  'skipped',
  'cancelled',
];

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const tokenSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: true,
      index: true,
    },
    tokenNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    serviceDate: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    customer: {
      type: customerSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: TOKEN_STATUSES,
      default: 'waiting',
      index: true,
    },
    assignedCounterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counter',
      default: null,
      index: true,
    },
    calledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tokenSchema.index(
  { queueId: 1, serviceDate: 1, tokenNumber: 1 },
  { unique: true, name: 'uq_token_per_queue_per_day' },
);

tokenSchema.index(
  { queueId: 1, serviceDate: 1, status: 1, tokenNumber: 1 },
  {
    partialFilterExpression: { status: 'waiting' },
    name: 'idx_next_waiting_token',
  },
);

tokenSchema.index(
  { status: 1, assignedCounterId: 1, calledAt: 1 },
  {
    partialFilterExpression: { status: 'serving' },
    name: 'idx_currently_serving_tokens',
  },
);

tokenSchema.index(
  { queueId: 1, serviceDate: 1, status: 1, calledAt: 1 },
  { name: 'idx_queue_serving_tokens' },
);

tokenSchema.index(
  { queueId: 1, serviceDate: 1, status: 1, createdAt: -1 },
  { name: 'idx_queue_service_status_createdAt' },
);

tokenSchema.index(
  { serviceDate: 1, status: 1, queueId: 1 },
  { name: 'idx_serviceDate_status_queue' },
);

const Token = mongoose.model('Token', tokenSchema);

module.exports = {
  Token,
  TOKEN_STATUSES,
};
