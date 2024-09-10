import csv

# Replace 'your_file.csv' with the path to your file
file_path = 'assets/companies.csv'

# Initialize an empty list to store dictionaries
companies = []

# Open the file and read it
with open(file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file, delimiter='\t')
    # Convert each row into a dictionary and add it to the list
    for row in reader:
        companies.append(row)


count = 0
for company in companies:
    
