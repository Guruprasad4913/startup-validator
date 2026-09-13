const express = require('express');
const router = express.Router();

const ideaController = require('../controllers/ideaController');


// =========================================================
// GENERATE REPORT
// POST /api/ideas/generate
// =========================================================

router.post(
  '/generate',
  ideaController.generateReport
);


// =========================================================
// LIST REPORTS
// GET /api/ideas
// =========================================================

router.get(
  '/',
  ideaController.listReports
);


// =========================================================
// DELETE REPORT
// DELETE /api/ideas/:id
// =========================================================

router.delete(
  '/:id',
  ideaController.deleteReport
);


// =========================================================
// GET SINGLE REPORT
// GET /api/ideas/:id
// =========================================================

router.get(
  '/:id',
  ideaController.getReport
);


module.exports = router;