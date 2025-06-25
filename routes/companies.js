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
  const { companyName, contactPerson, phone, email, department } = req.body;

  try {
    // Check if company exists
    let company = await Company.findOne({ companyName });

    if (company) {
      // Check if the contact already exists
      const duplicateContact = company.contacts.find(
        contact => contact.contactPerson.toLowerCase() === contactPerson.toLowerCase()
      );

      if (duplicateContact) {
        return res.status(400).json({ error: 'Contact person already exists for this company' });
      }

      // Add new contact to existing company
      company.contacts.push({ contactPerson, phone, email, department });
      await company.save();
      return res.status(201).json(company);
    } else {
      // New company with first contact
      const newCompany = new Company({
        companyName,
        contacts: [{ contactPerson, phone, email, department }]
      });
      await newCompany.save();
      return res.status(201).json(newCompany);
    }

  } catch (error) {
    console.error('Failed to save company:', error);
    res.status(500).json({ error: 'Failed to save company' });
  }
});


export default router;
