/* =========================================================
   STARTUP IDEA VALIDATOR
   COMPLETE FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const form = document.getElementById('idea-form');
const loginForm = document.getElementById('login-form');
const adminLoginPanel = document.getElementById('admin-login-panel');
const adminLoginSubmit = document.getElementById('admin-login-submit');
const backToUserLoginBtn = document.getElementById('back-to-user-login');

const appContainer = document.getElementById('app-container');

const signinModeBtn = document.getElementById('signin-mode-btn');
const signupModeBtn = document.getElementById('signup-mode-btn');

const bottomSwitch = document.getElementById('bottom-switch');

const authStatusEl = document.getElementById('auth-status');

const resultsEl = document.getElementById('results');
const reportDetailEl = document.getElementById('report-detail');
const reportBackBtn = document.getElementById('report-back-btn');
const reportDownloadBtn = document.getElementById('report-download-btn');
const statusEl = document.getElementById('status');

const submitBtn = document.getElementById('submit-btn');
const loginBtn = document.getElementById('login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');

const recentReportsListEl =
  document.getElementById('recent-reports-list');

const loadReportsBtn =
  document.getElementById('load-reports-btn');

const adminReportsListEl =
  document.getElementById('admin-reports-list');

const loadAdminReportsBtn =
  document.getElementById('load-admin-reports-btn');

const dashboardSection =
  document.getElementById('dashboard-section');

const userDashboardSection =
  document.getElementById('user-dashboard');

const adminDashboardSection =
  document.getElementById('admin-dashboard');

const loginSection =
  document.getElementById('login-section');

const logoutBtn =
  document.getElementById('logout-btn');

const userGreetingEl =
  document.getElementById('user-greeting');

const topbar =
  document.getElementById('topbar');

const authTitle =
  document.getElementById('auth-title');

const authDescription =
  document.getElementById('auth-description');

const authEyebrow =
  document.getElementById('auth-eyebrow');

const authButtonText =
  document.getElementById('auth-button-text');

const bottomQuestion =
  document.getElementById('bottom-question');

const passwordToggle =
  document.getElementById('password-toggle');

const passwordInput =
  document.getElementById('password');

const userAvatar =
  document.getElementById('user-avatar');

const forgotPasswordBtn =
  document.getElementById('forgot-password');


/* =========================================================
   DEBUG
========================================================= */

console.log(
  'Startup Idea Validator JavaScript loaded.'
);

console.log({
  form,
  loginForm,
  appContainer,
  signinModeBtn,
  signupModeBtn,
  bottomSwitch,
  loginBtn,
  passwordToggle,
  logoutBtn
});


/* =========================================================
   AUTH STATE
========================================================= */

let authToken =
  localStorage.getItem('startupAuthToken') || '';

let currentUser =
  localStorage.getItem('startupUsername') || '';

let currentUserRole =
  localStorage.getItem('startupUserRole') || '';

let authMode = 'signin';


/* =========================================================
   HELPER: SAFE JSON
========================================================= */

async function safeJson(response) {

  try {

    return await response.json();

  } catch (error) {

    return {};

  }

}


/* =========================================================
   AUTH STATUS
========================================================= */

function setAuthStatus(
  message = '',
  isError = false
) {

  if (!authStatusEl) {
    return;
  }

  authStatusEl.textContent = message;

  authStatusEl.classList.toggle(
    'error',
    isError
  );

}


/* =========================================================
   PAGE STATE
========================================================= */

function setPageState(
  authenticated,
  username = '',
  role = 'user'
) {

  if (!appContainer || !loginSection) {
    return;
  }


  if (authenticated) {

    /*
      SHOW APPLICATION
    */

    appContainer.classList.remove('hidden');

    loginSection.classList.add('hidden');


    if (dashboardSection) {

      dashboardSection.classList.remove('hidden');

    }


    if (topbar) {

      topbar.classList.remove('hidden');

    }


    /*
      ADMIN DASHBOARD
    */

    if (role === 'admin') {

      if (userDashboardSection) {

        userDashboardSection.classList.add('hidden');

      }

      if (adminDashboardSection) {

        adminDashboardSection.classList.remove('hidden');

      }

      if (userGreetingEl) {

        userGreetingEl.textContent =
          `Welcome back, ${username || 'Admin'}`;

      }

    }

    /*
      NORMAL USER DASHBOARD
    */

    else {

      if (userDashboardSection) {

        userDashboardSection.classList.remove('hidden');

      }

      if (adminDashboardSection) {

        adminDashboardSection.classList.add('hidden');

      }

      if (userGreetingEl) {

        userGreetingEl.textContent =
          `Welcome back, ${username || 'Founder'}`;

      }

    }


    /*
      AVATAR
    */

    if (userAvatar) {

      userAvatar.textContent =
        (username || 'U')
          .charAt(0)
          .toUpperCase();

    }

  }

  /*
    LOGGED OUT
  */

  else {

    appContainer.classList.add('hidden');

    loginSection.classList.remove('hidden');


    if (dashboardSection) {

      dashboardSection.classList.add('hidden');

    }


    if (topbar) {

      topbar.classList.add('hidden');

    }


    if (userGreetingEl) {

      userGreetingEl.textContent = '';

    }


    if (userDashboardSection) {

      userDashboardSection.classList.add('hidden');

    }


    if (adminDashboardSection) {

      adminDashboardSection.classList.add('hidden');

    }

  }

}


/* =========================================================
   AUTH MODE
========================================================= */

function updateAuthMode(mode) {

  authMode = mode;

  const isSignup =
    mode === 'signup';


  if (signinModeBtn) {

    signinModeBtn.classList.toggle(
      'active',
      !isSignup
    );

  }


  if (signupModeBtn) {

    signupModeBtn.classList.toggle(
      'active',
      isSignup
    );

  }


  if (isSignup) {

    if (authEyebrow) {

      authEyebrow.textContent =
        'GET STARTED';

    }

    if (authTitle) {

      authTitle.textContent =
        'Create your account';

    }

    if (authDescription) {

      authDescription.textContent =
        'Start discovering and validating your next startup idea.';

    }

    if (authButtonText) {

      authButtonText.textContent =
        'Create Account';

    }

    if (bottomQuestion) {

      bottomQuestion.textContent =
        'Already have an account?';

    }

    if (bottomSwitch) {

      bottomSwitch.textContent =
        'Sign in';

    }


    const adminNote =
      document.querySelector('.admin-note');

    if (adminNote) {

      adminNote.textContent =
        'Create a founder account to save your reports and return later.';

    }

  }

  else {

    if (authEyebrow) {

      authEyebrow.textContent =
        'WELCOME BACK';

    }

    if (authTitle) {

      authTitle.textContent =
        'Sign in to your account';

    }

    if (authDescription) {

      authDescription.textContent =
        'Continue building and validating your next big idea.';

    }

    if (authButtonText) {

      authButtonText.textContent =
        'Sign In';

    }

    if (bottomQuestion) {

      bottomQuestion.textContent =
        "Don't have an account?";

    }

    if (bottomSwitch) {

      bottomSwitch.textContent =
        'Create one';

    }


    const adminNote =
      document.querySelector('.admin-note');

    if (adminNote) {

      adminNote.textContent =
        'Administrator accounts have access to the admin dashboard.';

    }

  }


  /*
    Password autocomplete
  */

  if (passwordInput) {

    passwordInput.autocomplete =
      isSignup
        ? 'new-password'
        : 'current-password';

  }


  setAuthStatus('');

}


/* =========================================================
   SAVE AUTH
========================================================= */

function saveAuth(
  token,
  user
) {

  authToken =
    token || '';

  currentUser =
    user?.username || '';

  currentUserRole =
    user?.role || 'user';


  localStorage.setItem(
    'startupAuthToken',
    authToken
  );

  localStorage.setItem(
    'startupUsername',
    currentUser
  );

  localStorage.setItem(
    'startupUserRole',
    currentUserRole
  );

}


/* =========================================================
   CLEAR AUTH
========================================================= */

function clearAuth() {

  authToken = '';
  currentUser = '';
  currentUserRole = '';


  localStorage.removeItem(
    'startupAuthToken'
  );

  localStorage.removeItem(
    'startupUsername'
  );

  localStorage.removeItem(
    'startupUserRole'
  );

}


/* =========================================================
   REPORT PAGE
========================================================= */

function initializeReportPage() {

  const reportId =
    new URLSearchParams(
      window.location.search
    ).get('id');

  if (reportBackBtn) {

    reportBackBtn.addEventListener(
      'click',
      function () {

        if (
          window.history.length > 1
        ) {

          window.history.back();

        }
        else {

          window.close();

        }

      }
    );

  }

  if (reportDownloadBtn) {

    reportDownloadBtn.addEventListener(
      'click',
      function () {

        if (!reportId) {
          return;
        }

        const topic =
          document.getElementById(
            'report-page-title'
          )?.textContent || 'report';

        const htmlContent =
          document.getElementById(
            'report-detail'
          )?.outerHTML || '';

        const blob =
          new Blob(
            [
              `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${topic}</title></head><body>${htmlContent}</body></html>`
            ],
            {
              type: 'text/html;charset=utf-8'
            }
          );

        const link =
          document.createElement(
            'a'
          );

        const fileName =
          `${topic.replace(/\s+/g, '-').toLowerCase()}.html`;

        link.href =
          URL.createObjectURL(blob);

        link.download =
          fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

      }
    );

  }

  if (reportId) {

    loadReportById(reportId);

  }
  else {

    const empty =
      document.getElementById(
        'report-detail'
      );

    if (empty) {

      empty.innerHTML =
        '<div class="idea-card"><p>No report selected.</p></div>';

    }

  }

}

/* =========================================================
   INITIALIZE PAGE
========================================================= */

function initializePage() {

  console.log(
    'Initializing application...'
  );

  if (
    window.location.pathname
      .toLowerCase()
      .endsWith('report.html')
  ) {

    initializeReportPage();
    return;

  }


  if (authToken) {

    console.log(
      'Existing token found.'
    );

    setPageState(
      true,
      currentUser,
      currentUserRole || 'user'
    );

    updateAuthMode('signin');

    loadRecentReports();

  }

  else {

    console.log(
      'No authentication token found.'
    );

    setPageState(false);

    updateAuthMode('signin');

  }

}


/* =========================================================
   SIGN IN MODE BUTTON
========================================================= */

if (signinModeBtn) {

  signinModeBtn.addEventListener(
    'click',
    function () {

      updateAuthMode('signin');

    }
  );

}


/* =========================================================
   SIGN UP MODE BUTTON
========================================================= */

if (signupModeBtn) {

  signupModeBtn.addEventListener(
    'click',
    function () {

      updateAuthMode('signup');

    }
  );

}


/* =========================================================
   BOTTOM SWITCH
========================================================= */

if (bottomSwitch) {

  bottomSwitch.addEventListener(
    'click',
    function () {

      updateAuthMode(
        authMode === 'signin'
          ? 'signup'
          : 'signin'
      );

    }
  );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

if (passwordToggle && passwordInput) {

  passwordToggle.addEventListener(
    'click',
    function () {

      if (
        passwordInput.type === 'password'
      ) {

        passwordInput.type = 'text';

        passwordToggle.textContent =
          'Hide';

      }

      else {

        passwordInput.type =
          'password';

        passwordToggle.textContent =
          'Show';

      }

    }
  );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

if (forgotPasswordBtn) {

  forgotPasswordBtn.addEventListener(
    'click',
    function () {

      setAuthStatus(
        'Password reset is not configured yet.',
        true
      );

    }
  );

}


/* =========================================================
   LOGIN / SIGNUP
========================================================= */

function showUserLogin() {

  if (loginForm) {
    loginForm.classList.remove('hidden');
  }

  if (adminLoginPanel) {
    adminLoginPanel.classList.add('hidden');
  }

  if (authTitle) {
    authTitle.textContent = 'Sign in to your account';
  }

  if (authDescription) {
    authDescription.textContent = 'Continue building and validating your next big idea.';
  }

  if (authEyebrow) {
    authEyebrow.textContent = 'WELCOME BACK';
  }

  setAuthStatus('');

}

function showAdminLogin() {

  if (loginForm) {
    loginForm.classList.add('hidden');
  }

  if (adminLoginPanel) {
    adminLoginPanel.classList.remove('hidden');
  }

  if (authTitle) {
    authTitle.textContent = 'Admin login';
  }

  if (authDescription) {
    authDescription.textContent = 'Use your administrator credentials to access the admin dashboard.';
  }

  if (authEyebrow) {
    authEyebrow.textContent = 'SECURE ADMIN ACCESS';
  }

  setAuthStatus('');

}

if (adminLoginBtn) {

  adminLoginBtn.addEventListener(
    'click',
    function () {
      showAdminLogin();
    }
  );

}

if (backToUserLoginBtn) {

  backToUserLoginBtn.addEventListener(
    'click',
    function () {
      showUserLogin();
    }
  );

}

if (adminLoginSubmit) {

  adminLoginSubmit.addEventListener(
    'click',
    async function () {

      const adminUsernameInput =
        document.getElementById('admin-username');

      const adminPasswordInput =
        document.getElementById('admin-password');

      const username =
        adminUsernameInput
          ? adminUsernameInput.value.trim()
          : '';

      const password =
        adminPasswordInput
          ? adminPasswordInput.value
          : '';

      if (!username || !password) {
        setAuthStatus('Please enter the admin username and password.', true);
        return;
      }

      setAuthStatus('Signing in to admin dashboard...');

      try {

        const response = await fetch(
          '/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          }
        );

        const data = await safeJson(response);

        if (!response.ok) {
          setAuthStatus(data.error || 'Admin login failed.', true);
          return;
        }

        if (!data.token || !data.user) {
          setAuthStatus('Invalid admin response from the server.', true);
          return;
        }

        if (data.user.role !== 'admin') {
          setAuthStatus('This account does not have admin access.', true);
          return;
        }

        saveAuth(data.token, data.user);
        setPageState(true, currentUser, currentUserRole);
        setAuthStatus('');
        await loadRecentReports();

      }
      catch (error) {
        console.error('Admin login error:', error);
        setAuthStatus('Connection failed. Please try again.', true);
      }

    }
  );

}

if (loginForm) {

  loginForm.addEventListener(
    'submit',
    async function (e) {

      e.preventDefault();


      const usernameInput =
        document.getElementById('username');

      const passwordField =
        document.getElementById('password');


      const username =
        usernameInput
          ? usernameInput.value.trim()
          : '';

      const password =
        passwordField
          ? passwordField.value
          : '';


      console.log(
        'Authentication attempt:',
        {
          username,
          mode: authMode
        }
      );


      if (!username || !password) {

        setAuthStatus(
          'Please enter your username and password.',
          true
        );

        return;

      }


      const endpoint =
        authMode === 'signup'
          ? '/api/auth/signup'
          : '/api/auth/login';


      console.log(
        'Sending authentication request to:',
        endpoint
      );


      if (loginBtn) {

        loginBtn.disabled = true;

      }


      if (authButtonText) {

        authButtonText.textContent =
          authMode === 'signup'
            ? 'Creating account...'
            : 'Signing in...';

      }


      setAuthStatus('');


      try {

        const response =
          await fetch(
            endpoint,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({
                username,
                password
              })
            }
          );


        console.log(
          'Authentication response:',
          response.status,
          response.statusText
        );


        const data =
          await safeJson(response);


        console.log(
          'Authentication data:',
          data
        );


        if (!response.ok) {

          setAuthStatus(
            data.error ||
            data.message ||
            (
              authMode === 'signup'
                ? 'Signup failed.'
                : 'Login failed.'
            ),
            true
          );

          return;

        }


        /*
          Backend must return:
          {
            token: "...",
            user: {
              username: "...",
              role: "user"
            }
          }
        */

        if (
          !data.token ||
          !data.user
        ) {

          console.error(
            'Invalid authentication response:',
            data
          );

          setAuthStatus(
            'Server login response is invalid. Token or user information is missing.',
            true
          );

          return;

        }


        /*
          SAVE LOGIN
        */

        saveAuth(
          data.token,
          data.user
        );


        console.log(
          'Authentication successful:',
          {
            username: currentUser,
            role: currentUserRole
          }
        );


        /*
          SHOW DASHBOARD
        */

        setPageState(
          true,
          currentUser,
          currentUserRole
        );


        setAuthStatus('');


        /*
          LOAD SAVED REPORTS
        */

        await loadRecentReports();


      }

      catch (error) {

        console.error(
          'Authentication error:',
          error
        );


        setAuthStatus(
          'Connection failed. Make sure your backend server is running.',
          true
        );

      }

      finally {

        if (loginBtn) {

          loginBtn.disabled = false;

        }


        if (authButtonText) {

          authButtonText.textContent =
            authMode === 'signup'
              ? 'Create Account'
              : 'Sign In';

        }

      }

    }
  );

}


/* =========================================================
   REQUIRE AUTH
========================================================= */

function requireAuth() {

  if (!authToken) {

    setPageState(false);

    setAuthStatus(
      'Please log in before continuing.',
      true
    );

    return false;

  }


  if (!authToken.trim()) {

    clearAuth();

    setPageState(false);

    setAuthStatus(
      'Your session has expired. Please log in again.',
      true
    );

    return false;

  }


  return true;

}


/* =========================================================
   HANDLE UNAUTHORIZED
========================================================= */

function handleUnauthorized() {

  console.warn(
    'Authentication token is invalid or expired.'
  );


  clearAuth();

  setPageState(false);

  setAuthStatus(
    'Your session expired. Please log in again.',
    true
  );

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

  logoutBtn.addEventListener(
    'click',
    async function () {

      console.log(
        'Logging out...'
      );


      if (authToken) {

        try {

          await fetch(
            '/api/auth/logout',
            {
              method: 'POST',

              headers: {
                Authorization:
                  `Bearer ${authToken}`
              }
            }
          );

        }

        catch (error) {

          console.warn(
            'Logout request failed:',
            error
          );

        }

      }


      clearAuth();


      setPageState(false);


      if (form) {

        form.reset();

      }


      if (loginForm) {

        loginForm.reset();

      }


      if (resultsEl) {

        resultsEl.innerHTML = '';

      }


      if (recentReportsListEl) {

        recentReportsListEl.innerHTML = '';

      }


      if (adminReportsListEl) {

        adminReportsListEl.innerHTML = '';

      }


      if (statusEl) {

        statusEl.textContent = '';

      }


      updateAuthMode('signin');


      setAuthStatus(
        'You have been logged out.'
      );

    }
  );

}


/* =========================================================
   GENERATE REPORT
========================================================= */

if (form) {

  form.addEventListener(
    'submit',
    async function (e) {

      e.preventDefault();


      if (!requireAuth()) {

        return;

      }


      const interests =
        document.getElementById('interests')?.value.trim() || '';

      const skills =
        document.getElementById('skills')?.value.trim() || '';

      const domain =
        document.getElementById('domain')?.value.trim() || '';

      const budget =
        document.getElementById('budget')?.value.trim() || '';


      const payload = {

        interests,
        skills,
        domain,
        budget

      };


      console.log(
        'Generating report:',
        payload
      );


      if (resultsEl) {

        resultsEl.innerHTML = '';

      }


      if (statusEl) {

        statusEl.textContent =
          'Generating ideas, collecting market data, and validating...';

        statusEl.classList.add('loading');

      }


      if (submitBtn) {

        submitBtn.disabled = true;

      }


      try {

        const response =
          await fetch(
            '/api/ideas/generate',
            {
              method: 'POST',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${authToken}`

              },

              body:
                JSON.stringify(payload)

            }
          );


        const report =
          await safeJson(response);


        console.log(
          'Generate report response:',
          response.status,
          report
        );


        if (!response.ok) {

          if (
            response.status === 401
          ) {

            handleUnauthorized();

          }


          if (statusEl) {

            statusEl.textContent =
              report.error ||
              'Something went wrong.';

            statusEl.classList.remove(
              'loading'
            );

          }

          return;

        }


        if (statusEl) {

          statusEl.textContent =
            `Report generated at ${
              formatDate(
                report.generatedAt
              )
            }`;

          statusEl.classList.remove(
            'loading'
          );

        }


        renderReport(report);


        await loadRecentReports();


      }

      catch (error) {

        console.error(
          'Generate report error:',
          error
        );


        if (statusEl) {

          statusEl.textContent =
            `Network error: ${error.message}`;

          statusEl.classList.remove(
            'loading'
          );

        }

      }

      finally {

        if (submitBtn) {

          submitBtn.disabled = false;

        }

      }

    }
  );

}


/* =========================================================
   LOAD REPORT BUTTONS
========================================================= */

if (loadReportsBtn) {

  loadReportsBtn.addEventListener(
    'click',
    loadRecentReports
  );

}


if (loadAdminReportsBtn) {

  loadAdminReportsBtn.addEventListener(
    'click',
    loadRecentReports
  );

}


/* =========================================================
   LOAD REPORTS
========================================================= */

async function loadRecentReports() {

  if (!requireAuth()) {

    if (recentReportsListEl) {

      recentReportsListEl.innerHTML =
        `
        <p class="empty-state">
          Log in to view your saved reports.
        </p>
        `;

    }


    if (adminReportsListEl) {

      adminReportsListEl.innerHTML =
        `
        <p class="empty-state">
          Log in to view saved reports.
        </p>
        `;

    }

    return;

  }


  console.log(
    'Loading reports...'
  );


  try {

    const response =
      await fetch(
        '/api/ideas',
        {
          method: 'GET',

          headers: {

            Authorization:
              `Bearer ${authToken}`

          }
        }
      );


    const data =
      await safeJson(response);


    console.log(
      'Reports response:',
      response.status,
      data
    );


    if (!response.ok) {

      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;

      }


      throw new Error(
        data.error ||
        'Unable to load recent reports.'
      );

    }


    const reports =
      Array.isArray(data)
        ? data
        : [];


    if (
      currentUserRole === 'admin'
    ) {

      renderAdminReports(
        reports
      );

    }

    else {

      renderRecentReports(
        reports
      );

    }


  }

  catch (error) {

    console.error(
      'Load reports error:',
      error
    );


    const message =
      `
      <p class="empty-state">
        ${escapeHtml(
          error.message
        )}
      </p>
      `;


    if (
      currentUserRole === 'admin'
    ) {

      if (adminReportsListEl) {

        adminReportsListEl.innerHTML =
          message;

      }

    }

    else {

      if (recentReportsListEl) {

        recentReportsListEl.innerHTML =
          message;

      }

    }

  }

}


/* =========================================================
   RENDER RECENT REPORTS
========================================================= */

function renderRecentReports(
  reports = []
) {

  console.log(
    'Rendering user reports:',
    reports
  );


  if (!recentReportsListEl) {

    console.warn(
      'recent-reports-list element not found.'
    );

    return;

  }


  if (!Array.isArray(reports) || !reports.length) {

    recentReportsListEl.innerHTML =
      `
      <p class="empty-state">
        No saved reports yet.
        Generate your first idea to see it here.
      </p>
      `;

    return;

  }


  const visibleReports =
    reports.slice(0, 2);

  const remainingReports =
    reports.slice(2);

  recentReportsListEl.innerHTML =
    visibleReports
      .map(
        function (report) {

          return `

          <div class="recent-item">

            <h4>
              ${escapeHtml(
                report.topIdea ||
                'Untitled report'
              )}
            </h4>

            <p>
              ${escapeHtml(
                report.input?.domain ||
                'No domain supplied'
              )}
            </p>

            <p>
              ${formatDate(
                report.generatedAt
              )}
            </p>

            <div class="report-actions">

              <button
                type="button"
                class="view-report-btn"
                data-report-id="${escapeHtml(
                  report.id
                )}">
                View report
              </button>

              <button
                type="button"
                class="delete-report-btn"
                data-report-id="${escapeHtml(
                  report.id
                )}">
                Delete
              </button>

            </div>

          </div>

          `;

        }
      )
      .join('');

  if (remainingReports.length) {

    const moreBtn =
      document.createElement('button');

    moreBtn.type = 'button';
    moreBtn.className = 'secondary-btn more-reports-btn';
    moreBtn.textContent = `More (${remainingReports.length})`;

    moreBtn.addEventListener(
      'click',
      function () {

        recentReportsListEl.innerHTML =
          reports
            .map(
              function (report) {

                return `

                <div class="recent-item">

                  <h4>
                    ${escapeHtml(
                      report.topIdea ||
                      'Untitled report'
                    )}
                  </h4>

                  <p>
                    ${escapeHtml(
                      report.input?.domain ||
                      'No domain supplied'
                    )}
                  </p>

                  <p>
                    ${formatDate(
                      report.generatedAt
                    )}
                  </p>

                  <div class="report-actions">

                    <button
                      type="button"
                      class="view-report-btn"
                      data-report-id="${escapeHtml(
                        report.id
                      )}">
                      View report
                    </button>

                    <button
                      type="button"
                      class="delete-report-btn"
                      data-report-id="${escapeHtml(
                        report.id
                      )}">
                      Delete
                    </button>

                  </div>

                </div>

                `;

              }
            )
            .join('');

        bindRecentReportButtons();
      }
    );

    recentReportsListEl.appendChild(moreBtn);

  }

  bindRecentReportButtons();


  function bindRecentReportButtons() {

    recentReportsListEl
      .querySelectorAll(
        '.view-report-btn'
      )
      .forEach(
        function (button) {

          button.addEventListener(
            'click',
            function () {

              const reportId =
                button.getAttribute(
                  'data-report-id'
                );

              if (reportId) {

                openReportPage(
                  reportId
                );

              }

            }
          );

        }
      );

    recentReportsListEl
      .querySelectorAll(
        '.delete-report-btn'
      )
      .forEach(
        function (button) {

          button.addEventListener(
            'click',
            function () {

              const reportId =
                button.getAttribute(
                  'data-report-id'
                );

              if (reportId) {

                deleteReport(
                  reportId,
                  button
                );

              }

            }
          );

        }
      );

  }

}


/* =========================================================
   RENDER ADMIN REPORTS
========================================================= */

function renderAdminReports(
  reports = []
) {

  console.log(
    'Rendering admin reports:',
    reports
  );


  if (!adminReportsListEl) {

    return;

  }


  const totalReports =
    reports.length;


  const ownerSet =
    new Set(
      reports.map(
        function (report) {

          return (
            report.owner ||
            'Unknown'
          );

        }
      )
    );


  const activeUsers =
    Array.from(ownerSet)
      .filter(
        function (owner) {

          return owner !== 'Unknown';

        }
      )
      .length;


  const totalReportsEl =
    document.getElementById(
      'total-reports-count'
    );


  const activeUsersEl =
    document.getElementById(
      'active-users-count'
    );


  if (totalReportsEl) {

    totalReportsEl.textContent =
      totalReports;

  }


  if (activeUsersEl) {

    activeUsersEl.textContent =
      activeUsers;

  }


  if (!reports.length) {

    adminReportsListEl.innerHTML =
      `
      <p class="empty-state">
        No saved reports yet.
      </p>
      `;

    return;

  }


  adminReportsListEl.innerHTML =
    reports
      .map(
        function (report) {

          return `

          <div class="recent-item">

            <h4>
              ${escapeHtml(
                report.topIdea ||
                'Untitled report'
              )}
            </h4>

            <p>
              <strong>Owner:</strong>
              ${escapeHtml(
                report.owner ||
                'Unknown'
              )}
            </p>

            <p>
              ${escapeHtml(
                report.input?.domain ||
                'No domain supplied'
              )}
            </p>

            <p>
              ${formatDate(
                report.generatedAt
              )}
            </p>

            <button
              type="button"
              class="admin-view-report-btn"
              data-report-id="${escapeHtml(
                report.id
              )}">

              View report

            </button>

          </div>

          `;

        }
      )
      .join('');


  /*
    ADMIN VIEW BUTTONS
  */

  adminReportsListEl
    .querySelectorAll(
      '.admin-view-report-btn'
    )
    .forEach(
      function (button) {

        button.addEventListener(
          'click',
          function () {

            const reportId =
              button.getAttribute(
                'data-report-id'
              );

            if (reportId) {

              openReportPage(
                reportId
              );

            }

          }
        );

      }
    );

}


function openReportPage(id) {

  if (!id) {
    return;
  }

  const reportUrl =
    `report.html?id=${encodeURIComponent(id)}`;

  try {

    const popup =
      window.open(
        reportUrl,
        '_blank',
        'noopener,noreferrer'
      );

    if (!popup) {
      window.location.assign(reportUrl);
    }

  }
  catch (error) {

    window.location.assign(reportUrl);

  }

}

/* =========================================================
   LOAD SINGLE REPORT
========================================================= */

async function loadReportById(
  id
) {

  if (!requireAuth()) {

    return;

  }


  if (!id) {

    return;

  }


  console.log(
    'Loading report:',
    id
  );


  if (statusEl) {

    statusEl.textContent =
      'Loading report...';

    statusEl.classList.add(
      'loading'
    );

  }


  try {

    const response =
      await fetch(
        `/api/ideas/${encodeURIComponent(id)}`,
        {
          method: 'GET',

          headers: {

            Authorization:
              `Bearer ${authToken}`

          }

        }
      );


    const data =
      await safeJson(response);


    if (!response.ok) {

      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;

      }


      throw new Error(
        data.error ||
        'Unable to load that report.'
      );

    }


    renderReport(
      data
    );


    if (statusEl) {

      statusEl.textContent =
        `Loaded report from ${
          formatDate(
            data.generatedAt
          )
        }`;

      statusEl.classList.remove(
        'loading'
      );

    }

  }

  catch (error) {

    console.error(
      'Load report error:',
      error
    );


    if (statusEl) {

      statusEl.textContent =
        error.message;

      statusEl.classList.remove(
        'loading'
      );

    }

  }

}


/* =========================================================
   DELETE REPORT
========================================================= */

async function deleteReport(
  id,
  button
) {

  if (!requireAuth()) {

    return;

  }


  if (!id) {

    return;

  }


  const confirmed =
    confirm(
      'Are you sure you want to delete this report?\n\nThis action cannot be undone.'
    );


  if (!confirmed) {

    return;

  }


  const originalText =
    button
      ? button.textContent
      : 'Delete';


  if (button) {

    button.disabled = true;

    button.textContent =
      'Deleting...';

  }


  console.log(
    'Deleting report:',
    id
  );


  try {

    const response =
      await fetch(
        `/api/ideas/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',

          headers: {

            Authorization:
              `Bearer ${authToken}`

          }

        }
      );


    const data =
      await safeJson(response);


    console.log(
      'Delete response:',
      response.status,
      data
    );


    if (!response.ok) {

      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;

      }


      throw new Error(
        data.error ||
        'Unable to delete report.'
      );

    }


    if (statusEl) {

      statusEl.textContent =
        'Report deleted successfully.';

      statusEl.classList.remove(
        'loading'
      );

    }


    /*
      Clear currently displayed report
    */

    if (resultsEl) {

      resultsEl.innerHTML = '';

    }


    /*
      Refresh reports
    */

    await loadRecentReports();

  }

  catch (error) {

    console.error(
      'Delete report error:',
      error
    );


    if (statusEl) {

      statusEl.textContent =
        `Delete failed: ${error.message}`;

    }


    if (button) {

      button.disabled = false;

      button.textContent =
        originalText;

    }

  }

}


/* =========================================================
   RENDER FULL REPORT
========================================================= */

function renderReport(
  report
) {

  const targetEl =
    reportDetailEl || resultsEl;

  if (!targetEl) {

    return;

  }


  const ideas =
    Array.isArray(
      report?.ideas
    )
      ? report.ideas
      : [];


  if (!ideas.length) {

    targetEl.innerHTML =
      `
      <div class="idea-card">

        <p>
          No ideas were returned for this report.
        </p>

      </div>
      `;

    return;

  }


  targetEl.innerHTML =
    ideas
      .map(
        ideaCard
      )
      .join('');

}


/* =========================================================
   IDEA CARD
========================================================= */

function ideaCard(
  idea = {}
) {

  const marketData =
    idea.marketData || {};


  const coreFeatures =
    Array.isArray(
      idea.coreFeatures
    )
      ? idea.coreFeatures
      : [];


  const revenueModels =
    Array.isArray(
      idea.revenueModels
    )
      ? idea.revenueModels
      : [];


  const recommendedTechStack =
    Array.isArray(
      idea.recommendedTechStack
    )
      ? idea.recommendedTechStack
      : [];


  const competitors =
    Array.isArray(
      marketData.competitors
    )
      ? marketData.competitors
      : [];


  const targetAudience =
    idea.targetAudience ||
    {};


  const pros =
    Array.isArray(
      idea.pros
    )
      ? idea.pros
      : [];


  const cons =
    Array.isArray(
      idea.cons
    )
      ? idea.cons
      : [];


  const feasibilityScore =
    idea.feasibilityScore ??
    'N/A';


  const riskLevel =
    idea.riskLevel ||
    'Medium';


  const profitability =
    idea.businessSignals
      ?.profitabilityOutlook ||
    'N/A';


  const marketMomentum =
    idea.businessSignals
      ?.marketMomentum ||
    'N/A';


  return `

    <div class="idea-card">

      <h2>
        ${escapeHtml(
          idea.title ||
          'Untitled idea'
        )}
      </h2>


      <p class="desc">
        ${escapeHtml(
          idea.description ||
          'No description available.'
        )}
      </p>


      <div class="badge-row">

        <span class="badge score-badge">

          Feasibility:
          ${escapeHtml(
            feasibilityScore
          )}/100

        </span>


        <span class="badge risk-${escapeHtml(
          riskLevel
        )}">

          ${escapeHtml(
            riskLevel
          )}
          Risk

        </span>


        <span class="badge score-badge">

          Profitability:
          ${escapeHtml(
            profitability
          )}

        </span>

      </div>


      <div class="section-block">

        <h4>
          Business Snapshot
        </h4>


        <p>

          <strong>
            Market momentum:
          </strong>

          ${escapeHtml(
            marketMomentum
          )}

        </p>


        <p>

          <strong>
            Competition:
          </strong>

          ${escapeHtml(
            marketData.competitionLevel ||
            'Medium'
          )}

        </p>

      </div>


      <div class="section-block">

        <h4>
          Problem Solved
        </h4>

        <p>

          ${escapeHtml(
            idea.problemSolved ||
            'No problem statement provided.'
          )}

        </p>

      </div>


      ${
        pros.length
          ? `

          <div class="section-block">

            <h4>
              Advantages
            </h4>

            <ul>

              ${pros
                .map(
                  function (item) {

                    return `
                      <li>
                        ${escapeHtml(item)}
                      </li>
                    `;

                  }
                )
                .join('')}

            </ul>

          </div>

          `
          : ''
      }


      ${
        cons.length
          ? `

          <div class="section-block">

            <h4>
              Risks
            </h4>

            <ul>

              ${cons
                .map(
                  function (item) {

                    return `
                      <li>
                        ${escapeHtml(item)}
                      </li>
                    `;

                  }
                )
                .join('')}

            </ul>

          </div>

          `
          : ''
      }


      <div class="section-block">

        <h4>
          Core Features
        </h4>

        ${
          coreFeatures.length
            ? `
              <ul>

                ${coreFeatures
                  .map(
                    function (item) {

                      return `
                        <li>
                          ${escapeHtml(item)}
                        </li>
                      `;

                    }
                  )
                  .join('')}

              </ul>
            `
            : `
              <p>
                No core features specified.
              </p>
            `
        }

      </div>


      <div class="section-block">

        <h4>
          Target Audience
        </h4>

        <p>

          ${escapeHtml(
            targetAudience.primary ||
            'Not specified'
          )}

          ·

          ${escapeHtml(
            targetAudience.secondary ||
            'Not specified'
          )}

        </p>

      </div>


      <div class="section-block">

        <h4>
          Revenue Models
        </h4>

        ${
          revenueModels.length
            ? `
              <ul>

                ${revenueModels
                  .map(
                    function (item) {

                      return `
                        <li>
                          ${escapeHtml(item)}
                        </li>
                      `;

                    }
                  )
                  .join('')}

              </ul>
            `
            : `
              <p>
                No revenue model specified.
              </p>
            `
        }

      </div>


      <div class="section-block">

        <h4>
          Business Model
        </h4>

        <p>
          ${escapeHtml(
            idea.businessModel ||
            'No business model specified.'
          )}
        </p>

      </div>


      <div class="section-block">

        <h4>
          First Steps to Launch
        </h4>

        ${
          Array.isArray(idea.launchPlan) && idea.launchPlan.length
            ? `
              <ol>

                ${idea.launchPlan
                  .map(
                    function (item) {

                      return `
                        <li>
                          ${escapeHtml(item)}
                        </li>
                      `;

                    }
                  )
                  .join('')}

              </ol>
            `
            : `
              <p>
                Validate the offer with potential customers before investing heavily.
              </p>
            `
        }

      </div>


      <div class="section-block">

        <h4>
          Optional Technology
        </h4>

        ${
          recommendedTechStack.length
            ? `
              <ul>

                ${recommendedTechStack
                  .map(
                    function (item) {

                      return `
                        <li>
                          ${escapeHtml(item)}
                        </li>
                      `;

                    }
                  )
                  .join('')}

              </ul>
            `
            : `
              <p>
                No technology stack specified.
              </p>
            `
        }

      </div>


      <div class="section-block">

        <h4>
          Market Snapshot
        </h4>


        <p>

          Estimated market size:

          $

          ${Number(
            marketData
              .estimatedMarketSizeUSD ||
            0
          ).toLocaleString()}

        </p>


        <p>

          Sample competitors:

          ${
            competitors
              .map(
                function (item) {

                  return escapeHtml(
                    item
                  );

                }
              )
              .join(', ') ||
            'Not available'
          }

        </p>

      </div>

    </div>

  `;

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
  date
) {

  if (!date) {

    return 'Unknown date';

  }


  const parsed =
    new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return 'Unknown date';

  }


  return parsed.toLocaleString();

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
  value
) {

  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    String(
      value ?? ''
    );


  return div.innerHTML;

}


/* =========================================================
   START APPLICATION
========================================================= */

initializePage();