import os
import re
from docx import Document
import PyPDF2
import sys

# Configure output encoding
sys.stdout.reconfigure(encoding='utf-8')

# Read prices from PDF
def extract_prices_from_pdf():
    prices = {}
    try:
        with open('FOLDER WISE RATE-24-12-2025.pdf', 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            
            # Extract folder numbers and prices
            # Format: "002 TAARANI-A 4,997 ₹" or "002 TAARANI-A 4997"
            lines = text.split('\n')
            for line in lines:
                line_clean = line.strip()
                # Match pattern: folder number (2-3 digits), product name, price (with or without commas)
                # Pattern: "002 TAARANI-A 4,997" or "002 TAARANI-A 4997"
                match = re.search(r'^(\d{2,3})\s+([A-Z]+(?:-[A-Z]+)?)\s+(\d{1,3}(?:,\d{2,3})*)', line_clean)
                if match:
                    folder_num = match.group(1)
                    folder_name = match.group(2).upper()
                    price_str = match.group(3).replace(',', '')
                    price = int(price_str)
                    
                    if price > 100:  # Valid price check
                        prices[folder_num] = price
                        prices[folder_name] = price
                        print(f"  Found: Folder {folder_num} ({folder_name}) = Rs.{price}")
    except Exception as e:
        print(f"Error reading PDF: {e}")
        import traceback
        traceback.print_exc()
    
    return prices

# Extract description from DOCX
def extract_description(docx_path):
    try:
        doc = Document(docx_path)
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())
        description = ' '.join(full_text)
        # Clean up description - remove "STANDARD FORMAT" header if present
        if "STANDARD FORMAT" in description:
            # Extract only the KEY HIGHLIGHTS section
            highlights_match = re.search(r'KEY HIGHLIGHTS\s+(.+?)(?:\s*$|\s*SPECIFICATIONS)', description, re.DOTALL | re.IGNORECASE)
            if highlights_match:
                description = highlights_match.group(1).strip()
        # Replace problematic quotes
        description = description.replace('"', "'").replace('\n', ' ').replace('\r', ' ')
        # Remove extra spaces
        description = ' '.join(description.split())
        return description
    except Exception as e:
        print(f"Error reading {docx_path}: {e}")
        return ""

# Get all product folders
folders = sorted([d for d in os.listdir('.') if os.path.isdir(d) and d[0].isdigit()], 
                 key=lambda x: int(re.search(r'^(\d+)', x).group(1)) if re.search(r'^(\d+)', x) else 999)

products = []
product_id = 1
prices = extract_prices_from_pdf()

print(f"\nFound {len(folders)} folders")
print(f"Found {len(prices)} prices in PDF\n")

for folder in folders:
    folder_path = folder
    # Extract collection name (e.g., "TAARANI-A" from "002. TAARANI-A")
    collection_match = re.search(r'\d+\.\s*(.+)', folder)
    if collection_match:
        collection_name = collection_match.group(1).strip()
    else:
        collection_name = folder
    
    # Find all DESCRIPTION files in folder
    description_files = [f for f in os.listdir(folder_path) if f.endswith('DESCRIPTION.docx')]
    description_files.sort()
    
    # Find all image files
    image_files = [f for f in os.listdir(folder_path) if f.endswith(('.jpeg', '.jpg', '.png'))]
    image_files.sort()
    
    if len(description_files) == 0:
        print(f"Skipping {folder}: No description files")
        continue
    
    print(f"Processing {folder}: {len(description_files)} descriptions, {len(image_files)} images")
    
    # Get price for this folder
    folder_num_match = re.search(r'^(\d+)', folder)
    folder_num = folder_num_match.group(1) if folder_num_match else None
    
    price = None
    if folder_num and folder_num in prices:
        price = prices[folder_num]
    elif collection_name.upper() in prices:
        price = prices[collection_name.upper()]
    
    if not price:
        # Default prices based on collection type
        if 'UNIQUE' in collection_name.upper():
            price = 8655
        elif 'TAARANI' in collection_name.upper():
            price = 4997
        elif 'PEHNAVA' in collection_name.upper():
            price = 3658
        elif 'ZARIYA' in collection_name.upper():
            price = 6938
        elif 'SITARA' in collection_name.upper():
            price = 6219
        elif 'BLUSH' in collection_name.upper():
            price = 4720
        elif 'PRABHAT' in collection_name.upper():
            price = 2347
        elif 'SUNRISE' in collection_name.upper():
            price = 2489
        elif 'HERITAGE' in collection_name.upper():
            price = 7859
        elif 'TAPOVAN' in collection_name.upper():
            price = 14632
        elif 'AANGAN' in collection_name.upper():
            price = 6632
        elif 'CHIKUDI' in collection_name.upper():
            price = 11446
        elif 'GEHNA' in collection_name.upper():
            price = 9912
        elif 'ROYAL' in collection_name.upper():
            price = 5428
        elif 'MODERN' in collection_name.upper():
            price = 8024
        elif 'TEEN KERI' in collection_name.upper():
            price = 9263
        elif 'SRIVALLI' in collection_name.upper():
            price = 12762
        elif 'SATRANGI' in collection_name.upper():
            price = 8614
        elif 'MANNAT' in collection_name.upper():
            price = 10779
        elif 'DREAM' in collection_name.upper():
            price = 11487
        else:
            price = 5000  # Default
    
    # Create a product for each description file
    for idx, desc_file in enumerate(description_files):
        # Extract style number (e.g., "A1" from "TAARANI-A1 DESCRIPTION.docx")
        style_match = re.search(r'([A-Z]+-[A-Z]\d+)', desc_file)
        if style_match:
            style_name = style_match.group(1)
        else:
            style_name = f"{collection_name}-{idx+1}"
        
        # Read description
        desc_path = os.path.join(folder_path, desc_file)
        description = extract_description(desc_path)
        if not description or len(description) < 50:
            description = f"Elegant {collection_name} collection lehenga with intricate embroidery and traditional patterns, perfect for weddings and special occasions."
        
        # Find corresponding image
        image_name = desc_file.replace(' DESCRIPTION.docx', '.jpeg')
        if image_name not in image_files:
            # Try alternative naming
            base_name = desc_file.replace(' DESCRIPTION.docx', '')
            for img in image_files:
                if base_name in img:
                    image_name = img
                    break
        
        image_path = f"{folder_path}/{image_name}" if image_name in image_files else (f"{folder_path}/{image_files[0]}" if image_files else "")
        
        # Calculate original price (add 20-30% for sale)
        original_price = int(price * 1.25)
        savings = 20
        
        product = {
            'id': product_id,
            'name': f"{collection_name} Collection - Style {idx+1}",
            'category': 'lehenga',
            'price': price,
            'originalPrice': original_price,
            'image': image_path.replace('\\', '/'),
            'description': description,
            'specifications': {
                'gsm': '320-380',
                'material': 'Premium Fabric with Embroidery',
                'width': '44 inches',
                'colors': 'As per stock availability',
                'origin': 'India'
            },
            'supplier': 'BABISHA Collections',
            'rating': 4.5,
            'reviews': 100,
            'onSale': True,
            'savings': savings
        }
        
        products.append(product)
        product_id += 1
        print(f"  Added: {product['name']} - Rs.{price}")

# Generate JavaScript array
js_code = "const sampleFabrics = [\n"
for product in products:
    js_code += "    {\n"
    js_code += f"        id: {product['id']},\n"
    js_code += f"        name: \"{product['name']}\",\n"
    js_code += f"        category: \"{product['category']}\",\n"
    js_code += f"        price: {product['price']},\n"
    js_code += f"        originalPrice: {product['originalPrice']},\n"
    js_code += f"        image: \"{product['image']}\",\n"
    js_code += f"        description: \"{product['description']}\",\n"
    js_code += "        specifications: {\n"
    js_code += f"            gsm: \"{product['specifications']['gsm']}\",\n"
    js_code += f"            material: \"{product['specifications']['material']}\",\n"
    js_code += f"            width: \"{product['specifications']['width']}\",\n"
    js_code += f"            colors: \"{product['specifications']['colors']}\",\n"
    js_code += f"            origin: \"{product['specifications']['origin']}\"\n"
    js_code += "        },\n"
    js_code += f"        supplier: \"{product['supplier']}\",\n"
    js_code += f"        rating: {product['rating']},\n"
    js_code += f"        reviews: {product['reviews']},\n"
    js_code += f"        onSale: {product['onSale']},\n"
    js_code += f"        savings: {product['savings']}\n"
    js_code += "    },\n"

js_code += "];\n"

# Write to file
with open('new_products.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"\n✅ Generated {len(products)} products")
print("✅ Saved to new_products.js")
