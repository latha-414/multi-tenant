const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Tenant database configuration
const tenants = {
  "tenant-a": {
    user: process.env.TA_DB_USER || 'sqladmin',
    password: process.env.TA_DB_PASS || 'P@ssword1234!',
    server: 'sql-tenant-a-826m.database.windows.net',
    database: 'db-tenant-a',
    options: { encrypt: true }
  },
  "tenant-b": {
    user: process.env.TB_DB_USER || 'sqladmin',
    password: process.env.TB_DB_PASS || 'P@ssword1234!',
    server: 'sql-tenant-b-p034.database.windows.net',
    database: 'db-tenant-b',
    options: { encrypt: true }
  },
  "tenant-c": {
    user: process.env.TC_DB_USER || 'sqladmin',
    password: process.env.TC_DB_PASS || 'P@ssword1234!',
    server: 'sql-tenant-c-6m60.database.windows.net',
    database: 'db-tenant-c',
    options: { encrypt: true }
  }
};

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/user.html');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { tenant, username, password } = req.body;

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
});

app.listen(port, () => {
  console.log(`Multi-Tenant app running on port ${port}`);
});
