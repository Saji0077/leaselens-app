import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

def check_tables():
    """Check if the required tables and triggers exist in the database."""
    try:
        # Get database URL
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            print("Error: DATABASE_URL environment variable is not set")
            print("Please configure your .env file with your Supabase credentials")
            return False
        
        # Connect to database
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Check if loan_applications table exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'loan_applications'
            );
        """)
        table_exists = cur.fetchone()[0]
        
        if table_exists:
            print("Table found: public.loan_applications")
            
            # Get table columns
            cur.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'loan_applications'
                ORDER BY ordinal_position;
            """)
            columns = cur.fetchall()
            
            print("\nTable structure:")
            for col in columns:
                nullable = "NULL" if col[2] == "YES" else "NOT NULL"
                print(f"  - {col[0]}: {col[1]} {nullable}")
        else:
            print("Error: Table 'loan_applications' not found")
            print("Please run database.py to initialize the database")
            cur.close()
            conn.close()
            return False
        
        # Check if handle_new_user function exists
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM pg_proc 
                WHERE proname = 'handle_new_user'
            );
        """)
        function_exists = cur.fetchone()[0]
        
        if function_exists:
            print("\nFunction found: public.handle_new_user()")
        else:
            print("\nWarning: Function 'handle_new_user' not found")
        
        # Check if trigger exists on auth.users
        cur.execute("""
            SELECT EXISTS (
                SELECT FROM pg_trigger 
                WHERE tgname = 'on_auth_user_created'
            );
        """)
        trigger_exists = cur.fetchone()[0]
        
        if trigger_exists:
            print("Trigger found: on_auth_user_created")
        else:
            print("Warning: Trigger 'on_auth_user_created' not found")
            print("The automatic row creation on user signup may not work")
        
        # Check Row Level Security
        cur.execute("""
            SELECT relrowsecurity 
            FROM pg_class 
            WHERE relname = 'loan_applications';
        """)
        rls_enabled = cur.fetchone()
        
        if rls_enabled and rls_enabled[0]:
            print("Row Level Security: Enabled")
        else:
            print("Row Level Security: Not enabled")
        
        print("\n✓ Database verification completed")
        
        # Clean up
        cur.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"Database connection failed: {e}")
        return False
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    success = check_tables()
    sys.exit(0 if success else 1)