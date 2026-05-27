import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_database_url():
    """Get the database URL from environment variables."""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    return database_url

def get_connection():
    """Create and return a database connection."""
    database_url = get_database_url()
    conn = psycopg2.connect(database_url)
    return conn

def initialize_database():
    """Initialize the database by running the schema SQL file."""
    try:
        # Read the schema SQL file
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as file:
            schema_sql = file.read()
        
        # Connect to the database
        conn = get_connection()
        cur = conn.cursor()
        
        # Execute the schema SQL
        cur.execute(schema_sql)
        
        # Commit the changes
        conn.commit()
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        
        print("Database initialization completed successfully")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    initialize_database()