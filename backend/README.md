# LeaseLens Backend

Python FastAPI backend for the LeaseLens rental risk assessment app with Supabase PostgreSQL integration.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Supabase project with PostgreSQL database

### Configuration

1. Update the `.env` file with your Supabase credentials:
   ```
   DATABASE_URL=postgresql://postgres.[PROJECT ID]:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   ```
   
   **Important:** If your password contains special characters (`@`, `:`, `/`, `?`, `#`, `%`, `[`, `]`), URL-encode them:
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`
   - `?` → `%3F`
   - `#` → `%23`
   - `%` → `%25`
   - `[` → `%5B`
   - `]` → `%5D`

### Windows PowerShell Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Test database connection
python test_database_connection.py

# Initialize database tables
python database.py

# Check tables and triggers
python check_tables.py

# Run the server
python main.py
```

### macOS / Linux Terminal Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test database connection
python test_database_connection.py

# Initialize database tables
python database.py

# Check tables and triggers
python check_tables.py

# Run the server
python main.py
```

## API Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health check with database status
- `GET /docs` - Interactive API documentation (Swagger UI)

## Database Schema

The `loan_applications` table stores rental submission data and is linked to Supabase Auth:
- `id` - UUID matching the authenticated user's ID
- `first_name`, `last_name` - User's name
- `email_address`, `phone_number` - Contact information
- `loan_amount`, `loan_term`, `loan_purpose` - Rental details (column names preserved for compatibility)
- `created_at`, `updated_at` - Timestamps

### Automatic Features

1. **Row Level Security (RLS)** - Users can only access their own data
2. **Auto-row creation** - A new row is created automatically when a user signs up
3. **Timestamp updates** - `updated_at` is automatically updated on changes

## Testing

After setup, verify everything works:

1. Test connection: `python test_database_connection.py`
   - Expected: "Database connection successful"

2. Initialize database: `python database.py`
   - Expected: "Database initialization completed successfully"

3. Check tables: `python check_tables.py`
   - Expected: "Table found: public.loan_applications"

4. Run server: `python main.py`
   - Access docs at: http://127.0.0.1:8000/docs