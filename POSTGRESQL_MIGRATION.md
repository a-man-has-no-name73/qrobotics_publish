# PostgreSQL Migration Guide

## ✅ Migration Completed

Your Qrobotics project has been successfully migrated from MySQL to PostgreSQL!

## 🔧 What Was Changed

### 1. Database Configuration (`lib/db.ts`)

- ✅ Replaced `mysql2` with `pg` (PostgreSQL driver)
- ✅ Updated connection pool configuration
- ✅ Added query helper function

### 2. Environment Variables (`.env.local`)

- ✅ Updated to use PostgreSQL environment variables:
  ```bash
  DATABASE_HOST=localhost
  DATABASE_USER=postgres
  DATABASE_PASSWORD=postgres
  DATABASE_NAME=qrobotics
  DATABASE_PORT=5432
  ```

### 3. SQL Functions (`lib/sql/product_sql.tsx`)

- ✅ Replaced MySQL syntax with PostgreSQL syntax
- ✅ Changed `?` placeholders to `$1, $2, $3...` format
- ✅ Updated `IFNULL()` to `COALESCE()`
- ✅ Added `RETURNING` clauses for inserts
- ✅ Changed table names to lowercase (PostgreSQL convention)

### 4. API Routes (`app/api/admin/products/route.tsx`)

- ✅ Updated to use new PostgreSQL query function
- ✅ Removed MySQL connection pooling logic
- ✅ Updated SQL queries for PostgreSQL syntax

### 5. Test Scripts

- ✅ Updated database test script (`scripts/test-db.js`)
- ✅ Updated test API endpoint (`app/api/test_db/route.ts`)

## 🚀 Setup Instructions

### 1. Install PostgreSQL

Make sure you have PostgreSQL installed and running:

- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Create Database

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE qrobotics;

# Create user (optional)
CREATE USER qrobotics_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE qrobotics TO qrobotics_user;

# Exit
\q
```

### 3. Run Database Schema

```bash
# Run the schema file to create tables
psql -U postgres -d qrobotics -f database/schema.sql
```

### 4. Update Environment Variables

Update your `.env.local` file with your PostgreSQL credentials:

```bash
DATABASE_HOST=localhost
DATABASE_USER=postgres  # or qrobotics_user
DATABASE_PASSWORD=postgres  # your actual password
DATABASE_NAME=qrobotics
DATABASE_PORT=5432
```

### 5. Test Connection

```bash
# Test using the script
node scripts/test-db.js

# Or test via API (after starting the server)
# Visit: http://localhost:3000/api/test_db
```

## 📊 Key Differences: MySQL vs PostgreSQL

| Feature            | MySQL              | PostgreSQL                     |
| ------------------ | ------------------ | ------------------------------ |
| Placeholders       | `?`                | `$1, $2, $3...`                |
| Auto Increment     | `AUTO_INCREMENT`   | `SERIAL`                       |
| NULL handling      | `IFNULL()`         | `COALESCE()`                   |
| Case sensitivity   | Flexible           | Case sensitive (use lowercase) |
| Return inserted ID | `LAST_INSERT_ID()` | `RETURNING column_name`        |
| String quotes      | Both `'` and `"`   | Prefer `'` for strings         |

## 🔍 Troubleshooting

### Connection Issues

- Make sure PostgreSQL service is running
- Check firewall settings (port 5432)
- Verify credentials in `.env.local`

### Permission Issues

- Ensure user has proper database privileges
- Check database and table ownership

### SQL Errors

- PostgreSQL is more strict about SQL standards
- Use lowercase table/column names
- Use proper PostgreSQL data types

## 📝 Next Steps

1. **Test the migration**: Run your application and verify all features work
2. **Update any remaining SQL queries**: Check for any hardcoded MySQL syntax
3. **Performance tuning**: Configure PostgreSQL for your specific needs
4. **Backup strategy**: Set up regular PostgreSQL backups

## 🆘 Need Help?

If you encounter any issues:

1. Check the test database connection: `node scripts/test-db.js`
2. Review PostgreSQL logs
3. Verify environment variables
4. Check table names and column names match the schema

Your application is now ready to use PostgreSQL! 🎉
