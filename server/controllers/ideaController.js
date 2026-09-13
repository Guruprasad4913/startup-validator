const { v4: uuidv4 } = require('uuid');

const aiService =
  require('../services/aiService');

const marketService =
  require('../services/marketService');

const validationService =
  require('../services/validationService');

const storageService =
  require('../services/storageService');


/* =========================================================
   GENERATE REPORT
========================================================= */

exports.generateReport = async (
  req,
  res
) => {

  try {

    const {
      interests,
      skills,
      domain,
      budget
    } = req.body;


    if (
      !interests &&
      !skills &&
      !domain
    ) {

      return res
        .status(400)
        .json({
          error:
            'Please provide at least interests, skills, or a domain.'
        });

    }


    /* =====================================================
       STEP 1: AI IDEA GENERATION
    ===================================================== */

    let ideas = [];


    try {

      ideas =
        await aiService.generateIdeas({
          interests,
          skills,
          domain,
          budget
        });

    } catch (err) {

      console.warn(
        'AI generation failed, using fallback ideas:',
        err.message
      );


      ideas = [

        {
          title:
            'AI-assisted workflow assistant',

          description:
            'A hands-on service business tailored to the user profile that solves a specific customer problem and can start with a small local pilot.',

          problemSolved:
            'Gives customers in the chosen domain a reliable way to get help with an important recurring need.',

          businessModel:
            'Charge per service, then offer repeat-service packages to returning customers.',

          launchPlan: [
            'Interview potential customers',
            'Deliver the service manually to a small pilot group',
            'Turn the repeatable work into a fixed-price package'
          ],

          coreFeatures: [
            'Task automation',
            'Smart recommendations',
            'Usage analytics'
          ],

          initialTechSuggestions: [
            'Node.js',
            'React',
            'MongoDB'
          ]

        },


        {
          title:
            'Specialty products for the chosen domain',

          description:
            'A small product business serving a focused audience with useful, relevant products and direct customer relationships.',

          problemSolved:
            'Makes it easier for customers in the chosen domain to find products that fit their needs.',

          businessModel:
            'Start with small-batch or made-to-order sales, then grow through bundles and repeat orders.',

          launchPlan: [
            'Choose a small product range after customer interviews',
            'Run a paid small-batch test',
            'Reinvest early revenue into the best-selling products'
          ],

          coreFeatures: [
            'Listings',
            'Discovery filters',
            'Community reviews'
          ],

          initialTechSuggestions: [
            'Express',
            'Next.js',
            'PostgreSQL'
          ]

        },


        {
          title:
            'Specialist consulting for the chosen domain',

          description:
            'A practical consulting or training business that applies the founder\'s skills to improve a measurable result for customers in the chosen domain.',

          problemSolved:
            'Helps domain-specific businesses improve without hiring a full-time specialist.',

          businessModel:
            'Sell an initial assessment, a fixed implementation package, and optional monthly support.',

          launchPlan: [
            'Define one measurable customer outcome',
            'Deliver a discounted pilot for two businesses',
            'Package the repeatable work at a fixed price'
          ],

          coreFeatures: [
            'Data summaries',
            'Trend detection',
            'Alerting'
          ],

          initialTechSuggestions: [
            'Python',
            'FastAPI',
            'MongoDB'
          ]

        }

      ];

    }


    /* =====================================================
       STEP 2: MARKET DATA
    ===================================================== */

    const ideasWithMarketData =
      await Promise.all(

        ideas.map(
          async (idea) => {

            try {

              const marketData =
                await marketService.getMarketData(
                  idea
                );

              return {
                ...idea,
                marketData
              };

            } catch (err) {

              console.warn(
                'Market data collection failed, using fallback market data:',
                err.message
              );


              return {

                ...idea,

                marketData: {

                  trendScore: 72,

                  competitionLevel:
                    'Medium',

                  estimatedMarketSizeUSD:
                    2500000,

                  competitors: [
                    'Competitor A',
                    'Competitor B'
                  ],

                  links: []

                }

              };

            }

          }
        )

      );


    /* =====================================================
       STEP 3: MARKET VALIDATION
    ===================================================== */

    const validatedIdeas =
      ideasWithMarketData.map(
        (idea) =>

          validationService.validate({

            ...idea,

            inputContext: {
              interests,
              skills,
              domain,
              budget
            }

          })
      );


    /* =====================================================
       STEP 4: CREATE REPORT
    ===================================================== */

    const report = {

      id: uuidv4(),

      owner:
        req.user.username,

      input: {
        interests,
        skills,
        domain,
        budget
      },

      generatedAt:
        new Date().toISOString(),

      ideas:
        validatedIdeas.sort(
          (a, b) =>
            b.feasibilityScore -
            a.feasibilityScore
        )

    };


    /* =====================================================
       STEP 5: SAVE REPORT
    ===================================================== */

    await storageService.saveReport(
      report
    );


    /* =====================================================
       STEP 6: RETURN REPORT
    ===================================================== */

    res.json(report);


  } catch (err) {

    console.error(err);

    res
      .status(500)
      .json({
        error:
          'Failed to generate startup report.',

        details:
          err.message
      });

  }

};


/* =========================================================
   GET SINGLE REPORT
========================================================= */

exports.getReport = async (
  req,
  res
) => {

  try {

    const report =
      await storageService.getReport(
        req.params.id
      );


    if (!report) {

      return res
        .status(404)
        .json({
          error:
            'Report not found.'
        });

    }


    /*
      Admin can access all reports.

      Normal users can only access
      their own reports.
    */

    if (
      req.user.role !== 'admin' &&
      report.owner !== req.user.username
    ) {

      return res
        .status(403)
        .json({
          error:
            'Access denied.'
        });

    }


    res.json(report);


  } catch (err) {

    console.error(
      'Get report error:',
      err
    );

    res
      .status(500)
      .json({
        error:
          'Failed to fetch report.'
      });

  }

};


/* =========================================================
   LIST REPORTS
========================================================= */

exports.listReports = async (
  req,
  res
) => {

  try {

    const reports =
      await storageService.listReports(
        req.user
      );


    res.json(reports);


  } catch (err) {

    console.error(
      'List reports error:',
      err
    );

    res
      .status(500)
      .json({
        error:
          'Failed to list reports.'
      });

  }

};


/* =========================================================
   DELETE REPORT
========================================================= */

exports.deleteReport = async (
  req,
  res
) => {

  try {

    const reportId =
      req.params.id;


    if (!reportId) {

      return res
        .status(400)
        .json({
          error:
            'Report ID is required.'
        });

    }


    /*
      First find the report.
      We need the owner before deleting.
    */

    const report =
      await storageService.getReport(
        reportId
      );


    if (!report) {

      return res
        .status(404)
        .json({
          error:
            'Report not found.'
        });

    }


    /*
      SECURITY:
      Admin can delete any report.

      Normal user can only delete
      their own report.
    */

    if (
      req.user.role !== 'admin' &&
      report.owner !== req.user.username
    ) {

      return res
        .status(403)
        .json({
          error:
            'You can only delete your own reports.'
        });

    }


    /*
      Delete from MongoDB
    */

    const result =
      await storageService.deleteReport(
        reportId
      );


    if (
      !result ||
      result.deletedCount !== 1
    ) {

      return res
        .status(500)
        .json({
          error:
            'Report could not be deleted.'
        });

    }


    console.log(
      `Report deleted: ${reportId} by ${req.user.username}`
    );


    res.json({

      success: true,

      message:
        'Report deleted successfully.',

      id:
        reportId

    });


  } catch (err) {

    console.error(
      'Delete report error:',
      err
    );

    res
      .status(500)
      .json({
        error:
          'Failed to delete report.',

        details:
          err.message
      });

  }

};