"""Setup script to create .env file with Azure OpenAI configuration."""
import os

def create_env_file():
    
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        print(f"[INFO] .env file already exists. Overwriting...")
    
    try:
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(env_content)
        print(f"[SUCCESS] .env file created successfully at: {env_path}")
        print("[INFO] Please keep your API keys secure and never commit .env to version control!")
    except Exception as e:
        print(f"[ERROR] Error creating .env file: {e}")

if __name__ == "__main__":
    create_env_file()
