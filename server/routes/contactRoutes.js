const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. GET /api/contacts - List public or unlocked contacts
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const givenCode = (req.query.code || '').trim();

    // If code is provided, fetch secret contacts under that code; otherwise fetch public contacts
    const filter = { userId };
    if (givenCode) {
      filter.hide_code = givenCode;
    } else {
      filter.$or = [{ hide_code: null }, { hide_code: '' }, { hide_code: { $exists: false } }];
    }

    const contacts = await Contact.find(filter).sort({ name: 1 });

    return res.status(200).json({
      status: 200,
      count: contacts.length,
      contacts: contacts.map(c => c.toClientJSON(Boolean(givenCode)))
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
});

  // 2. QUERY /api/contacts - Search and filter contacts using the modern HTTP QUERY method
  const queryHandler = async (req, res) => {
    try {
      const userId = req.user.userId;
      const q = (req.body?.q || req.query?.q || '').trim();
      const givenCode = (req.body?.code || req.query?.code || '').trim();

      const filter = { userId };
      if (givenCode) {
        filter.hide_code = givenCode;
      } else {
        filter.$or = [{ hide_code: null }, { hide_code: '' }, { hide_code: { $exists: false } }];
      }

      if (q) {
        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$and = [
          {
            $or: [
              { name: regex },
              { ph_no: regex },
              { email: regex },
              { company_name: regex },
              { relation_profession: regex }
            ]
          }
        ];
      }

      const results = await Contact.find(filter).sort({ name: 1 });

      return res.status(200).json({
        status: 200,
        search_query: q,
        code_provided: Boolean(givenCode),
        count: results.length,
        contacts: results.map(c => c.toClientJSON(Boolean(givenCode)))
      });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
    }
  };

// Support both HTTP QUERY on resource root and GET fallback
router.query('/', auth, queryHandler);
router.get('/search', auth, queryHandler);

// 3. POST /api/contacts - Create a new contact
router.post('/', auth, async (req, res) => {
  try {
    const { name, ph_no, email, company_name, relation_profession, image_url, hide_code } = req.body;

    if (!name || !ph_no) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
        message: 'Name and Phone Number are required.'
      });
    }

    const contact = new Contact({
      userId: req.user.userId,
      name: name.trim(),
      ph_no: ph_no.trim(),
      email: email ? email.trim() : '',
      company_name: company_name ? company_name.trim() : '',
      relation_profession: relation_profession ? relation_profession.trim() : '',
      image_url: image_url ? image_url.trim() : '',
      hide_code: hide_code ? hide_code.trim() : null
    });

    await contact.save();

    return res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      contact: contact.toClientJSON(Boolean(hide_code))
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
});

// 4. GET /api/contacts/:c_id - Get a single contact
router.get('/:c_id', auth, async (req, res) => {
  try {
    const { c_id } = req.params;
    if (!isValidObjectId(c_id)) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    const contact = await Contact.findOne({ _id: c_id, userId: req.user.userId });
    if (!contact) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    // If contact is secret, verify that the caller provided the matching code
    if (contact.hide_code && contact.hide_code.trim()) {
      const givenCode = (req.query.code || '').trim();
      if (givenCode !== contact.hide_code) {
        return res.status(403).json({
          status: 403,
          error: 'Forbidden',
          message: 'This contact is hidden. Provide the correct code to view.'
        });
      }
    }

    return res.status(200).json({ status: 200, contact: contact.toClientJSON(true) });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
});

// 5. PUT /api/contacts/:c_id - Update a contact
router.put('/:c_id', auth, async (req, res) => {
  try {
    const { c_id } = req.params;
    if (!isValidObjectId(c_id)) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    const contact = await Contact.findOne({ _id: c_id, userId: req.user.userId });
    if (!contact) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    const { name, ph_no, email, company_name, relation_profession, image_url, hide_code } = req.body;
    if (name !== undefined) contact.name = name.trim();
    if (ph_no !== undefined) contact.ph_no = ph_no.trim();
    if (email !== undefined) contact.email = email.trim();
    if (company_name !== undefined) contact.company_name = company_name.trim();
    if (relation_profession !== undefined) contact.relation_profession = relation_profession.trim();
    if (image_url !== undefined) contact.image_url = image_url.trim();
    if (hide_code !== undefined) contact.hide_code = hide_code ? hide_code.trim() : null;

    await contact.save();

    return res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      contact: contact.toClientJSON(true)
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
});

// 6. DELETE /api/contacts/:c_id - Delete a contact
router.delete('/:c_id', auth, async (req, res) => {
  try {
    const { c_id } = req.params;
    if (!isValidObjectId(c_id)) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    const deleted = await Contact.findOneAndDelete({ _id: c_id, userId: req.user.userId });
    if (!deleted) {
      return res.status(404).json({ status: 404, error: 'Not Found', message: 'Contact not found.' });
    }

    return res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
