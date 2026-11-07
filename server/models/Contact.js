const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100
  },
  ph_no: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  company_name: {
    type: String,
    trim: true,
    default: ''
  },
  relation_profession: {
    type: String,
    trim: true,
    default: ''
  },
  image_url: {
    type: String,
    trim: true,
    default: ''
  },
  hide_code: {
    type: String,
    trim: true,
    default: null,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Format output matching original Flask & REST client schema expectations
contactSchema.methods.toClientJSON = function (includeHideCode = false) {
  const isHidden = Boolean(this.hide_code && this.hide_code.trim());
  const data = {
    c_id: this._id,
    user_id: this.userId,
    name: this.name,
    ph_no: this.ph_no,
    email: this.email || '',
    company_name: this.company_name || '',
    relation_profession: this.relation_profession || '',
    image_url: this.image_url || '',
    is_hidden: isHidden,
    created_at: this.createdAt
  };

  // Only expose the secret hide_code when explicitly authorized (e.g. valid unlock or single get)
  if (includeHideCode) {
    data.hide_code = this.hide_code || '';
  }

  return data;
};

module.exports = mongoose.model('Contact', contactSchema);
