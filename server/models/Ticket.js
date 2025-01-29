const { mongoose, Schema } = require('mongoose')

const TicketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, required: true },
  responses: { type: [], required: false },
});

module.exports = mongoose.model('Tickets', TicketSchema);