const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Tenant DB config
const tenants = {
  "tenant-a": {
    user: 'sqladmin',
    password: 'P@ssword1234!',
    server: 'sql-alpha-ib41.database.windows.net',
    database: 'db-alpha-ib41',
    options: { encrypt: true }
  },
  "tenant-b": {
    user: 'sqladmin',
    password: 'P@ssword1234!',
    server: 'sql-beta-kozg.database.windows.net',
    database: 'db-beta-kozg',
    options: { encrypt: true }
  },
  "tenant-c": {
    user: 'sqladmin',
    password: 'P@ssword1234!',
    server: 'sql-gamma-m9f0.database.windows.net',
    database: 'db-gamma-m9f0',
    options: { encrypt: true }
  }
};

// -----------------------------
// 1️⃣ HOME PAGE ROUTE
// -----------------------------
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/user.html');
});

// -----------------------------
// 2️⃣ REQUIRED GET ROUTES FOR APP GATEWAY PATH RULES
// -----------------------------
app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/user.html');
});

app.get('/route', (req, res) => {
  res.sendFile(__dirname + '/user.html');
});

// -----------------------------
// 3️⃣ COMMON LOGIN FUNCTION
// -----------------------------
async function tenantLogin(tenant, username, password, res) {
  if (!tenant || !tenants[tenant]) {
    return res.send('Invalid tenant selected');
  }

  try {
    const pool = await sql.connect(tenants[tenant]);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE username=@username AND password=@password');

    if (result.recordset.length > 0) {
      res.send(`Login successful! Welcome ${username} of ${tenant}`);
    } else {
      res.send('Invalid username or password');
    }

    await pool.close();
  } catch (err) {
    console.error(err);
    res.send('Error connecting to database');
  }
}

// -----------------------------
// 4️⃣ DEFAULT LOGIN
// -----------------------------
app.post('/login', async (req, res) => {
  const { tenant, username, password } = req.body;
  tenantLogin(tenant, username, password, res);
});

// -----------------------------
// 5️⃣ /api/login
// -----------------------------
app.post('/api/login', async (req, res) => {
  const { tenant, username, password } = req.body;
  tenantLogin(tenant, username, password, res);
});

// -----------------------------
// 6️⃣ /route/login
// -----------------------------
app.post('/route/login', async (req, res) => {
  const { tenant, username, password } = req.body;
  tenantLogin(tenant, username, password, res);
});


// Server start
app.listen(port, () => {
  console.log(`Multi-Tenant app running on port ${port}`);
});
