const Report = require('../models/reportModel');


// =========================================================
// BUILD REPORT SUMMARIES
// =========================================================

function buildReportSummaries(reports = []) {

  return reports
    .slice()
    .sort(
      (a, b) =>
        new Date(b.generatedAt || 0) -
        new Date(a.generatedAt || 0)
    )
    .map(
      ({
        id,
        owner,
        input,
        generatedAt,
        ideas
      }) => ({
        id,
        owner: owner || 'Unknown',
        input,
        generatedAt,
        topIdea:
          ideas?.[0]?.title || null
      })
    );
}


// =========================================================
// SAVE REPORT
// =========================================================

async function saveReport(report) {

  const saved =
    await Report.create(report);

  return saved.toObject();
}


// =========================================================
// GET SINGLE REPORT
// =========================================================

async function getReport(id) {

  const report =
    await Report.findOne({
      id
    }).lean();

  return report;
}


// =========================================================
// LIST REPORTS
// =========================================================

async function listReports(user = {}) {

  const query = {};


  /*
    Admin can see all reports.
  */

  if (user.role !== 'admin') {

    query.owner =
      user.username;

  }


  const reports =
    await Report.find(
      query,
      {
        id: 1,
        owner: 1,
        input: 1,
        generatedAt: 1,
        ideas: 1
      }
    ).lean();


  return buildReportSummaries(
    reports
  );
}


// =========================================================
// DELETE REPORT
// =========================================================

async function deleteReport(id) {

  const result =
    await Report.deleteOne({
      id
    });

  return result;
}


// =========================================================
// EXPORT
// =========================================================

module.exports = {

  saveReport,

  getReport,

  listReports,

  deleteReport,

  buildReportSummaries

};