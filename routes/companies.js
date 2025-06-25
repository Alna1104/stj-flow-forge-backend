import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyName, contacts } = req.body;

    if (!companyName || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: 'Company name and at least one contact are required' });
    }

    const existingCompany = await Company.findOne({ companyName });

    if (existingCompany) {
      const newContacts = [];

      for (const contact of contacts) {
        const duplicate = existingCompany.contacts.find(c => c.contactPerson === contact.contactPerson);
        if (duplicate) {
          return res.status(409).json({ error: `Contact ${contact.contactPerson} already exists for this company` });
        }
        newContacts.push(contact);
      }

      existingCompany.contacts.push(...newContacts);
      const updated = await existingCompany.save();
      return res.status(200).json(updated);
    }

    // Create new company
    const newCompany = new Company({ companyName, contacts });
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    console.error('Error creating/updating company:', err);
    res.status(500).json({ error: 'Server error while adding company' });
  }
});


export default router;
