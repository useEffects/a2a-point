import sys
from lib import read_json, write_json
import os

# Function to update the build numbers
def update_build_numbers(folder_path):
    try:
        # Construct the full app.json path from the folder
        app_json_path = os.path.join(folder_path, "app.json")

        # Read the existing app.json data
        app_data = read_json(app_json_path)

        # Get current build numbers
        ios_build_number = app_data['expo']['ios']['buildNumber']
        ios_build_number_parts = ios_build_number.split('.')
        if len(ios_build_number_parts) == 2:
            major, minor = ios_build_number_parts
            # Increment the minor part and keep the major part the same
            new_ios_build_number = f"{major}.{int(minor) + 1}"
            app_data['expo']['ios']['buildNumber'] = new_ios_build_number

        
        android_version_code = int(app_data['expo']['android']['versionCode'])
        app_data['expo']['android']['versionCode'] = android_version_code + 1

        # Write the updated data back to app.json
        write_json(app_json_path, app_data)

        print("Successfully updated the build numbers!")
    except Exception as e:
        print(f"Error updating build numbers: {e}")

# Main function to execute the update
def main():
    if len(sys.argv) != 2:
        print("Usage: python update_build_numbers.py <folder_path>")
        sys.exit(1)
    
    folder_path = sys.argv[1]
    
    # Ensure the folder path is valid
    if not os.path.isdir(folder_path):
        print(f"Error: The folder '{folder_path}' does not exist.")
        sys.exit(1)
    
    update_build_numbers(folder_path)

if __name__ == "__main__":
    main()
