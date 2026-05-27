import os
import sys
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

def test_connection():
    """Test the database connection without exposing sensitive information."""
    try:
        # Get database URL
        database_url = os.getenv('DATABASE_URL')
        
        if not database_url:
            print("Error: DATABASE_URL environment variable is not set")
            print("Please configure your .env file with your Supabase credentials")
            return False
        
        # Mask the password for safe display
        masked_url = database_url
        if '@' in database_url:
            # Split at @ to separate credentials from host
            parts = database_url.split('@')
            if ':' in parts[0]:
                # Replace password with ***
                cred_parts = parts[0].rpartition(':')
                masked_url = f"{cred_parts[0]}:***@{parts[1]}"
        
        print(f"Attempting to connect to: {masked_url}")
        
        # Attempt connection
        conn = psycopg2.connect(database_url)
        
        # Test with a simple query
        cur = conn.cursor()
        cur.execute("SELECT version();")
        db_version = cur.fetchone()
        
        print("Database connection successful")
        print(f"PostgreSQL version: {db_version[0]}")
        
        # Clean up
        cur.close()
        conn.close()
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"Database connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check if DATABASE_URL is correctly set in .env file")
        print("2. Verify your Supabase project is active")
        print("3. Ensure your IP is allowed in Supabase database settings")
        print("4. Check if special characters in password are URL-encoded")
        return False
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)