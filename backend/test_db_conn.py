import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def diagnostic_test():
    host = os.getenv("DB_HOST", "localhost")
    try:
        port_str = os.getenv("DB_PORT", "3306")
        port = int(port_str)
    except ValueError:
        print(f"ERROR: Invalid port number '{port_str}' in .env")
        return

    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASSWORD", "arkan07")
    db_name = os.getenv("DB_NAME", "class_material_manager")

    print("--- Database Connection Diagnostics ---")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"User: {user}")
    print(f"Password: {'*' * len(password)} (Length: {len(password)})")
    print(f"Target Database: {db_name}")
    print("-" * 40)

    # 1. Test Server Connection (without database)
    print("\nPhase 1: Testing server connectivity (no database specified)...")
    try:
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        print("[SUCCESS] Connected to MySQL server!")
        conn.close()
    except Exception as e:
        print(f"[FAILED] Could not connect to MySQL server.")
        print(f"   Error: {e}")
        return

    # 2. Test Connection with Database
    print(f"\nPhase 2: Testing connection to database '{db_name}'...")
    try:
        conn = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port,
            database=db_name
        )
        print(f"[SUCCESS] Connected to database '{db_name}'!")
        
        # 3. Check for tables
        print("\nPhase 3: Checking existing tables and data...")
        with conn.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            if tables:
                print(f"[SUCCESS] Found {len(tables)} tables:")
                for table in tables:
                    table_name = table[0]
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    count = cursor.fetchone()[0]
                    print(f"   - {table_name}: {count} rows")
            else:
                print("[WARNING] No tables found in this database.")
        
        conn.close()
    except pymysql.err.InternalError as e:
        if e.args[0] == 1049:
            print(f"[FAILED] Database '{db_name}' does not exist.")
            print(f"   Hint: You may need to create the database manually using: CREATE DATABASE {db_name};")
        else:
            print(f"[FAILED] Database error: {e}")
    except Exception as e:
        print(f"[FAILED] Could not access database '{db_name}'.")
        print(f"   Error: {e}")

if __name__ == "__main__":
    diagnostic_test()
