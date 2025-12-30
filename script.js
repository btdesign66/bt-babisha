// BABISHA - Lehenga Collection Website JavaScript
console.log('BABISHA script loaded successfully!');

// Global Variables
let currentUser = null;
let fabricData = [];
let filteredFabrics = [];
let currentPageNumber = 1;
let itemsPerPage = 6;

const sampleFabrics = [
    {
        id: 1,
        name: "TAARANI-A Collection - Style 1",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "002. TAARANI-A/TAARANI-A1.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 2,
        name: "TAARANI-A Collection - Style 2",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "002. TAARANI-A/TAARANI-A2.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 3,
        name: "TAARANI-A Collection - Style 3",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "002. TAARANI-A/TAARANI-A3.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 4,
        name: "TAARANI-A Collection - Style 4",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "002. TAARANI-A/TAARANI-A4.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 5,
        name: "TAARANI-B Collection - Style 1",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "003. TAARANI-B/TAARANI-B1.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 6,
        name: "TAARANI-B Collection - Style 2",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "003. TAARANI-B/TAARANI-B2.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 7,
        name: "TAARANI-B Collection - Style 3",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "003. TAARANI-B/TAARANI-B3.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 8,
        name: "TAARANI-B Collection - Style 4",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "003. TAARANI-B/TAARANI-B4.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 9,
        name: "TAARANI-C Collection - Style 1",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "004. TAARANI-C/TAARANI-C1.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 10,
        name: "TAARANI-C Collection - Style 2",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "004. TAARANI-C/TAARANI-C2.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 11,
        name: "TAARANI-C Collection - Style 3",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "004. TAARANI-C/TAARANI-C3.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 12,
        name: "TAARANI-C Collection - Style 4",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "004. TAARANI-C/TAARANI-C4.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 13,
        name: "TAARANI-D Collection - Style 1",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "005. TAARANI-D/TAARANI-D1.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 14,
        name: "TAARANI-D Collection - Style 2",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "005. TAARANI-D/TAARANI-D2.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 15,
        name: "TAARANI-D Collection - Style 3",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "005. TAARANI-D/TAARANI-D3.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 16,
        name: "TAARANI-D Collection - Style 4",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "005. TAARANI-D/TAARANI-D4.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 17,
        name: "TAARANI-E Collection - Style 1",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "006. TAARANI-E/TAARANI-E1.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 18,
        name: "TAARANI-E Collection - Style 2",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "006. TAARANI-E/TAARANI-E2.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 19,
        name: "TAARANI-E Collection - Style 3",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "006. TAARANI-E/TAARANI-E3.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 20,
        name: "TAARANI-E Collection - Style 4",
        category: "lehenga",
        price: 4997,
        originalPrice: 6246,
        image: "006. TAARANI-E/TAARANI-E4.jpeg",
        description: "Crafted using premium Burberry Silk for a rich and luxurious feel Matching Burberry Silk blouse included for a coordinated look Lightweight Net Silk dupatta adds elegance and comfort Enhanced with fine Jari & Stone work for a festive shine Semi-stitched lehenga (44” size) offers easy customization Available in beautiful festive colours: Pink with Blue, Purple with Light-Gajari (as per stock’s Availability) Perfect choice for festive occasions, parties, and celebrations Regular-fit design ensures comfort for long hours Dry-clean-only fabric to maintain original shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 21,
        name: "UNIQUE-A Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "007. UNIQUE-A/UNIQUE-A1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 22,
        name: "UNIQUE-A Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "007. UNIQUE-A/UNIQUE-A2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 23,
        name: "UNIQUE-B Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "008. UNIQUE-B/UNIQUE-B1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 24,
        name: "UNIQUE-B Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "008. UNIQUE-B/UNIQUE-B2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 25,
        name: "UNIQUE-C Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "009. UNIQUE-C/UNIQUE-C1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 26,
        name: "UNIQUE-C Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "009. UNIQUE-C/UNIQUE-C2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 27,
        name: "UNIQUE-D Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "010. UNIQUE-D/UNIQUE-D1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 28,
        name: "UNIQUE-D Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "010. UNIQUE-D/UNIQUE-D2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 29,
        name: "UNIQUE-E Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "011. UNIQUE-E/UNIQUE-E1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 30,
        name: "UNIQUE-E Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "011. UNIQUE-E/UNIQUE-E2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 31,
        name: "UNIQUE-F Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "012. UNIQUE-F/UNIQUE-F1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 32,
        name: "UNIQUE-F Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "012. UNIQUE-F/UNIQUE-F2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 33,
        name: "UNIQUE-G Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "013. UNIQUE-G/UNIQUE-G1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 34,
        name: "UNIQUE-G Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "013. UNIQUE-G/UNIQUE-G2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 35,
        name: "UNIQUE-H Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "014. UNIQUE-H/UNIQUE-H1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 36,
        name: "UNIQUE-H Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "014. UNIQUE-H/UNIQUE-H2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 37,
        name: "UNIQUE-I Collection - Style 1",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "015. UNIQUE-I/UNIQUE-I1.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 38,
        name: "UNIQUE-I Collection - Style 2",
        category: "lehenga",
        price: 8655,
        originalPrice: 10818,
        image: "015. UNIQUE-I/UNIQUE-I2.jpeg",
        description: "Crafted from luxurious velvet fabric ensuring rich texture and royal appearance Embellished with intricate zari and sequin embroidery for a stunning look Net dupatta enhanced with velvet border adds elegance and grace Perfect choice for weddings, receptions, and festive functions Semi-stitched design allows convenient fitting customization Lightweight yet grand, ensuring comfort for long hours of wear Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 39,
        name: "PEHNAVA-A Collection - Style 1",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "016. PEHNAVA-A/PEHNAVA-A1.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 40,
        name: "PEHNAVA-A Collection - Style 2",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "016. PEHNAVA-A/PEHNAVA-A2.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 41,
        name: "PEHNAVA-A Collection - Style 3",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "016. PEHNAVA-A/PEHNAVA-A3.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 42,
        name: "PEHNAVA-B Collection - Style 1",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "017. PEHNAVA-B/PEHNAVA-B1.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 43,
        name: "PEHNAVA-B Collection - Style 2",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "017. PEHNAVA-B/PEHNAVA-B2.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 44,
        name: "PEHNAVA-B Collection - Style 3",
        category: "lehenga",
        price: 3658,
        originalPrice: 4572,
        image: "017. PEHNAVA-B/PEHNAVA-B3.jpeg",
        description: "Made from high-quality fabrics that offer a rich and luxurious feel Showcases intricate embroidery with exceptional attention to detail Comes with a coordinated blouse piece and dupatta for a complete bridal look Suitable for weddings, receptions, and high-end festive occasions Semi-stitched for effortless customization and a flawless fit Lightweight and comfortable for extended wear A perfect fusion of traditional craftsmanship and contemporary style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 45,
        name: "ZARIYA-B Collection - Style 1",
        category: "lehenga",
        price: 6938,
        originalPrice: 8672,
        image: "020. ZARIYA-B/ZARIYA-B1.jpeg",
        description: "Luxurious velvet lehenga and blouse offering a rich and premium look Elegant net dupatta enhancing the overall bridal appearance Intricate heavy zari and sequin embroidery for a grand festive shine Bridal pattern crafted specially for weddings and traditional occasions Semi-stitched design for easy size adjustments and perfect fitting Comfortable regular fit suitable for long wedding functions Comes with matching lehenga, blouse, and dupatta as a complete set Combines traditional craftsmanship with a modern, elegant style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 46,
        name: "ZARIYA-B Collection - Style 2",
        category: "lehenga",
        price: 6938,
        originalPrice: 8672,
        image: "020. ZARIYA-B/ZARIYA-B2.jpeg",
        description: "Luxurious velvet lehenga and blouse offering a rich and premium look Elegant net dupatta enhancing the overall bridal appearance Intricate heavy zari and sequin embroidery for a grand festive shine Bridal pattern crafted specially for weddings and traditional occasions Semi-stitched design for easy size adjustments and perfect fitting Comfortable regular fit suitable for long wedding functions Comes with matching lehenga, blouse, and dupatta as a complete set Combines traditional craftsmanship with a modern, elegant style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 47,
        name: "ZARIYA-B Collection - Style 3",
        category: "lehenga",
        price: 6938,
        originalPrice: 8672,
        image: "020. ZARIYA-B/ZARIYA-B3.jpeg",
        description: "Luxurious velvet lehenga and blouse offering a rich and premium look Elegant net dupatta enhancing the overall bridal appearance Intricate heavy zari and sequin embroidery for a grand festive shine Bridal pattern crafted specially for weddings and traditional occasions Semi-stitched design for easy size adjustments and perfect fitting Comfortable regular fit suitable for long wedding functions Comes with matching lehenga, blouse, and dupatta as a complete set Combines traditional craftsmanship with a modern, elegant style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 48,
        name: "ZARIYA-C Collection - Style 1",
        category: "lehenga",
        price: 6938,
        originalPrice: 8672,
        image: "021. ZARIYA-C/ZARIYA-C1.jpeg",
        description: "Luxurious velvet lehenga and blouse offering a rich and premium look Elegant net dupatta enhancing the overall bridal appearance Intricate heavy zari and sequin embroidery for a grand festive shine Bridal pattern crafted specially for weddings and traditional occasions Semi-stitched design for easy size adjustments and perfect fitting Comfortable regular fit suitable for long wedding functions Comes with matching lehenga, blouse, and dupatta as a complete set Combines traditional craftsmanship with a modern, elegant style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 49,
        name: "ZARIYA-C Collection - Style 2",
        category: "lehenga",
        price: 6938,
        originalPrice: 8672,
        image: "021. ZARIYA-C/ZARIYA-C2.jpeg",
        description: "Luxurious velvet lehenga and blouse offering a rich and premium look Elegant net dupatta enhancing the overall bridal appearance Intricate heavy zari and sequin embroidery for a grand festive shine Bridal pattern crafted specially for weddings and traditional occasions Semi-stitched design for easy size adjustments and perfect fitting Comfortable regular fit suitable for long wedding functions Comes with matching lehenga, blouse, and dupatta as a complete set Combines traditional craftsmanship with a modern, elegant style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 50,
        name: "SITARA-B Collection - Style 1",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "022. SITARA-B/SITARA-B1.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 51,
        name: "SITARA-B Collection - Style 2",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "022. SITARA-B/SITARA-B2.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 52,
        name: "SITARA-B Collection - Style 3",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "022. SITARA-B/SITARA-B3.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 53,
        name: "SITARA-B Collection - Style 4",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "022. SITARA-B/SITARA-B4.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 54,
        name: "SITARA-A Collection - Style 1",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "023. SITARA-A/SITARA-A1.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 55,
        name: "SITARA-A Collection - Style 2",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "023. SITARA-A/SITARA-A2.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 56,
        name: "SITARA-A Collection - Style 3",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "023. SITARA-A/SITARA-A3.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 57,
        name: "SITARA-A Collection - Style 4",
        category: "lehenga",
        price: 6219,
        originalPrice: 7773,
        image: "023. SITARA-A/SITARA-A4.jpeg",
        description: "Crafted from high-quality net fabric with a refined, luxurious finish Intricately designed with fine zari work for a rich ethnic appeal Includes a beautifully coordinated blouse and dupatta Ideal for weddings, receptions, and festive celebrations Semi-stitched for convenient customization and perfect fitting Comfortable, lightweight, and suitable for long-duration wear Blends timeless traditional style with modern sophistication",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 58,
        name: "BLUSH-A Collection - Style 1",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "024. BLUSH-A/BLUSH-A1.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 59,
        name: "BLUSH-A Collection - Style 2",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "024. BLUSH-A/BLUSH-A2.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 60,
        name: "BLUSH-A Collection - Style 3",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "024. BLUSH-A/BLUSH-A3.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 61,
        name: "BLUSH-A Collection - Style 4",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "024. BLUSH-A/BLUSH-A4.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 62,
        name: "BLUSH-A Collection - Style 5",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "024. BLUSH-A/BLUSH-A5.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 63,
        name: "BLUSH-B Collection - Style 1",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "025. BLUSH-B/BLUSH-B1.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 64,
        name: "BLUSH-B Collection - Style 2",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "025. BLUSH-B/BLUSH-B2.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 65,
        name: "BLUSH-B Collection - Style 3",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "025. BLUSH-B/BLUSH-B3.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 66,
        name: "BLUSH-B Collection - Style 4",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "025. BLUSH-B/BLUSH-B4.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 67,
        name: "BLUSH-B Collection - Style 5",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "025. BLUSH-B/BLUSH-B5.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 68,
        name: "BLUSH-C Collection - Style 1",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "026. BLUSH-C/BLUSH-C1.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 69,
        name: "BLUSH-C Collection - Style 2",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "026. BLUSH-C/BLUSH-C2.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 70,
        name: "BLUSH-C Collection - Style 3",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "026. BLUSH-C/BLUSH-C3.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 71,
        name: "BLUSH-C Collection - Style 4",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "026. BLUSH-C/BLUSH-C4.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 72,
        name: "BLUSH-C Collection - Style 5",
        category: "lehenga",
        price: 4720,
        originalPrice: 5900,
        image: "026. BLUSH-C/BLUSH-C5.jpeg",
        description: "Crafted from premium-quality net fabric for a lightweight and elegant look Enhanced with Zari & Jarkan embroidery, giving a rich and festive appearance Semi-stitched lehenga allows easy alteration and comfortable fitting up to 44 inches Comes with a matching net blouse and net dupatta for a complete coordinated set Ideal for reception, festive functions, weddings, and party wear Regular fit design ensures comfort for long-duration wear A perfect blend of traditional craftsmanship and modern styling Lightweight outfit suitable for customers seeking elegant and easy-to-carry occasion wear",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 73,
        name: "PRABHAT-A Collection - Style 1",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "028. PRABHAT-A/PRABHAT-A1.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 74,
        name: "PRABHAT-A Collection - Style 2",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "028. PRABHAT-A/PRABHAT-A2.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 75,
        name: "PRABHAT-A Collection - Style 3",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "028. PRABHAT-A/PRABHAT-A3.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 76,
        name: "PRABHAT-A Collection - Style 4",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "028. PRABHAT-A/PRABHAT-A4.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 77,
        name: "PRABHAT-E Collection - Style 1",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "029. PRABHAT-E/PRABHAT-E1.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 78,
        name: "PRABHAT-E Collection - Style 2",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "029. PRABHAT-E/PRABHAT-E2.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 79,
        name: "PRABHAT-E Collection - Style 3",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "029. PRABHAT-E/PRABHAT-E3.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 80,
        name: "PRABHAT-E Collection - Style 4",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "029. PRABHAT-E/PRABHAT-E4.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 81,
        name: "PRABHAT-E Collection - Style 5",
        category: "lehenga",
        price: 2347,
        originalPrice: 2933,
        image: "029. PRABHAT-E/PRABHAT-E5.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 82,
        name: "SUNRISE-A Collection - Style 1",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "030. SUNRISE-A/SUNRISE-A1.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 83,
        name: "SUNRISE-A Collection - Style 2",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "030. SUNRISE-A/SUNRISE-A2.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 84,
        name: "SUNRISE-A Collection - Style 3",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "030. SUNRISE-A/SUNRISE-A3.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 85,
        name: "SUNRISE-A Collection - Style 4",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "030. SUNRISE-A/SUNRISE-A4.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 86,
        name: "SUNRISE-B Collection - Style 1",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "031. SUNRISE-B/SUNRISE-B1.jpeg",
        description: "Premium Burberry Silk lehenga and blouse for a rich, smooth finish Soft Net Silk dupatta adds elegance and comfort Decorated with fine Jari & Stone work for a festive, premium look Semi-stitched design (44” size) for easy customization Available in stunning colours: Wine, Grey, Blue & Gajari (as per stock’s availability) Ideal for festive functions, parties, and special celebrations Comfortable regular fit suitable for long-duration wear Dry-clean-only fabric to maintain shine and durability",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 87,
        name: "SUNRISE-B Collection - Style 2",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "031. SUNRISE-B/SUNRISE-B2.jpeg",
        description: "Premium Burberry Silk lehenga and blouse for a rich, smooth finish Soft Net Silk dupatta adds elegance and comfort Decorated with fine Jari & Stone work for a festive, premium look Semi-stitched design (44” size) for easy customization Available in stunning colours: Wine, Grey, Blue & Gajari (as per stock’s availability) Ideal for festive functions, parties, and special celebrations Comfortable regular fit suitable for long-duration wear Dry-clean-only fabric to maintain shine and durability",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 88,
        name: "SUNRISE-B Collection - Style 3",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "031. SUNRISE-B/SUNRISE-B3.jpeg",
        description: "Premium Burberry Silk lehenga and blouse for a rich, smooth finish Soft Net Silk dupatta adds elegance and comfort Decorated with fine Jari & Stone work for a festive, premium look Semi-stitched design (44” size) for easy customization Available in stunning colours: Wine, Grey, Blue & Gajari (as per stock’s availability) Ideal for festive functions, parties, and special celebrations Comfortable regular fit suitable for long-duration wear Dry-clean-only fabric to maintain shine and durability",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 89,
        name: "SUNRISE-B Collection - Style 4",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "031. SUNRISE-B/SUNRISE-B4.jpeg",
        description: "Premium Burberry Silk lehenga and blouse for a rich, smooth finish Soft Net Silk dupatta adds elegance and comfort Decorated with fine Jari & Stone work for a festive, premium look Semi-stitched design (44” size) for easy customization Available in stunning colours: Wine, Grey, Blue & Gajari (as per stock’s availability) Ideal for festive functions, parties, and special celebrations Comfortable regular fit suitable for long-duration wear Dry-clean-only fabric to maintain shine and durability",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 90,
        name: "SUNRISE-C Collection - Style 1",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "032. SUNRISE-C/SUNRISE-C1.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 91,
        name: "SUNRISE-C Collection - Style 2",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "032. SUNRISE-C/SUNRISE-C2.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 92,
        name: "SUNRISE-C Collection - Style 3",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "032. SUNRISE-C/SUNRISE-C3.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 93,
        name: "SUNRISE-C Collection - Style 4",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "032. SUNRISE-C/SUNRISE-C4.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 94,
        name: "SUNRISE-D Collection - Style 1",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "033. SUNRISE-D/SUNRISE-D1.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 95,
        name: "SUNRISE-D Collection - Style 2",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "033. SUNRISE-D/SUNRISE-D2.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 96,
        name: "SUNRISE-D Collection - Style 3",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "033. SUNRISE-D/SUNRISE-D3.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 97,
        name: "SUNRISE-D Collection - Style 4",
        category: "lehenga",
        price: 2489,
        originalPrice: 3111,
        image: "033. SUNRISE-D/SUNRISE-D4.jpeg",
        description: "Made from premium Burberry Silk fabric for a rich, smooth and elegant finish Matching Burberry Silk blouse and dupatta included Enhanced with fine Jari & Stone work for refined festive detailing Semi-stitched lehenga with 44” size for comfortable customization Available in attractive colours: Pink, Green-Mehendi, Light-Wine & Light-Blue (as per Stocks’s Availability) Ideal for festive wear, parties and special occasions Regular-fit design ensures comfort during long-duration wear Dry-clean-only maintenance for long-lasting shine and fabric quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 98,
        name: "HERITAGE Collection - Style 1",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A1.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 99,
        name: "HERITAGE Collection - Style 2",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A2.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 100,
        name: "HERITAGE Collection - Style 3",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A3.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 101,
        name: "HERITAGE Collection - Style 4",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A4.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 102,
        name: "HERITAGE Collection - Style 5",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A5.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 103,
        name: "HERITAGE Collection - Style 6",
        category: "lehenga",
        price: 7859,
        originalPrice: 9823,
        image: "035. HERITAGE/HERITAGE-A6.jpeg",
        description: "Satin & Rapier fabric for a rich and premium look Detailed Jari, Stone & Sequence work for an elegant festive finish Semi-stitched lehenga (44” size) for easy fitting and customization Includes matching satin blouse and rapier dupatta Available in vibrant colours: Green, Chiku, Mehendi, Purple, Gajari & Blue (as per stock availability) Ideal for reception, party wear, and festive occasions Regular-fit design ensures comfort during long hours Dry-clean-only garment to maintain shine and quality",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 104,
        name: "TAPOVAN Collection - Style 1",
        category: "lehenga",
        price: 14632,
        originalPrice: 18290,
        image: "036. TAPOVAN/TAPOVAN-A1.jpeg",
        description: "Premium-quality Italian Silk fabric for an elegant look Detailed Jari & Jarkan embroidery with fine craftsmanship Comes with matching blouse and net dupatta Ideal for weddings, receptions, and festive occasions Semi-stitched design for easy customization (up to size 44) Ensures regular fit and long-duration comfort Stylish blend of traditional and modern design Lightweight and comfortable for long wear High-quality finish for a luxurious bridal appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 105,
        name: "TAPOVAN Collection - Style 2",
        category: "lehenga",
        price: 14632,
        originalPrice: 18290,
        image: "036. TAPOVAN/TAPOVAN-A2.jpeg",
        description: "Premium-quality Italian Silk fabric for an elegant look Detailed Jari & Jarkan embroidery with fine craftsmanship Comes with matching blouse and net dupatta Ideal for weddings, receptions, and festive occasions Semi-stitched design for easy customization (up to size 44) Ensures regular fit and long-duration comfort Stylish blend of traditional and modern design Lightweight and comfortable for long wear High-quality finish for a luxurious bridal appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 106,
        name: "TAPOVAN Collection - Style 3",
        category: "lehenga",
        price: 14632,
        originalPrice: 18290,
        image: "036. TAPOVAN/TAPOVAN-A3.jpeg",
        description: "Premium-quality Italian Silk fabric for an elegant look Detailed Jari & Jarkan embroidery with fine craftsmanship Comes with matching blouse and net dupatta Ideal for weddings, receptions, and festive occasions Semi-stitched design for easy customization (up to size 44) Ensures regular fit and long-duration comfort Stylish blend of traditional and modern design Lightweight and comfortable for long wear High-quality finish for a luxurious bridal appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 107,
        name: "TAPOVAN Collection - Style 4",
        category: "lehenga",
        price: 14632,
        originalPrice: 18290,
        image: "036. TAPOVAN/TAPOVAN-A4.jpeg",
        description: "Premium-quality Italian Silk fabric for an elegant look Detailed Jari & Jarkan embroidery with fine craftsmanship Comes with matching blouse and net dupatta Ideal for weddings, receptions, and festive occasions Semi-stitched design for easy customization (up to size 44) Ensures regular fit and long-duration comfort Stylish blend of traditional and modern design Lightweight and comfortable for long wear High-quality finish for a luxurious bridal appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 108,
        name: "TAPOVAN Collection - Style 5",
        category: "lehenga",
        price: 14632,
        originalPrice: 18290,
        image: "036. TAPOVAN/TAPOVAN-A5.jpeg",
        description: "Premium-quality Italian Silk fabric for an elegant look Detailed Jari & Jarkan embroidery with fine craftsmanship Comes with matching blouse and net dupatta Ideal for weddings, receptions, and festive occasions Semi-stitched design for easy customization (up to size 44) Ensures regular fit and long-duration comfort Stylish blend of traditional and modern design Lightweight and comfortable for long wear High-quality finish for a luxurious bridal appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 109,
        name: "AANGAN-A Collection - Style 1",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "037. AANGAN-A/AANGAN-A1.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 110,
        name: "AANGAN-A Collection - Style 2",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "037. AANGAN-A/AANGAN-A2.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 111,
        name: "AANGAN-A Collection - Style 3",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "037. AANGAN-A/AANGAN-A3.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 112,
        name: "AANGAN-B Collection - Style 1",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "038. AANGAN-B/AANGAN-B1.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 113,
        name: "AANGAN-B Collection - Style 2",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "038. AANGAN-B/AANGAN-B2.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 114,
        name: "AANGAN-B Collection - Style 3",
        category: "lehenga",
        price: 6632,
        originalPrice: 8290,
        image: "038. AANGAN-B/AANGAN-B3.jpeg",
        description: "Premium-quality Velvet Fabric for a rich and royal look Heavy Jari & Jarkan embroidery for a luxurious bridal appeal Comes with matching velvet blouse and elegant net dupatta Ideal for wedding, reception, and grand festive events Semi-stitched lehenga allows easy customization Soft velvet ensures comfort and perfect drape Traditional craftsmanship blended with modern bridal styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 115,
        name: "CHIKUDI-A Collection - Style 1",
        category: "lehenga",
        price: 11446,
        originalPrice: 14307,
        image: "039. CHIKUDI-A/CHIKUDI-A1.jpeg",
        description: "Crafted from high-quality Silk & Italian fabric Velvet blouse provides a royal and rich texture Two dupattas included: main net dupatta + secondary net dupatta Designed with detailed work to give a grand bridal appeal Semi-stitched lehenga supports all body fittings Ideal for wedding rituals, photoshoots & reception functions Simple yet elegant single chiku colour palette Ensures comfort for long bridal events",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 116,
        name: "CHIKUDI-B Collection - Style 1",
        category: "lehenga",
        price: 11446,
        originalPrice: 14307,
        image: "040. CHIKUDI-B/CHIKUDI-B1.jpeg",
        description: "Fashionable Gown-style lehenga for a modern festive look Made with soft Passion Print fabric for smooth movement Net dupatta adds an elegant, lightweight finishing touch Embellished with Jari–Jarkan work for festive shine Perfect for haldi, sangeet, reception & wedding functions Semi-stitched pattern ensures easy waist and length adjustments Designed for customers seeking a mix of style and comfort",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 117,
        name: "CHIKUDI-B Collection - Style 2",
        category: "lehenga",
        price: 11446,
        originalPrice: 14307,
        image: "040. CHIKUDI-B/CHIKUDI-B2.jpeg",
        description: "Fashionable Gown-style lehenga for a modern festive look Made with soft Passion Print fabric for smooth movement Net dupatta adds an elegant, lightweight finishing touch Embellished with Jari–Jarkan work for festive shine Perfect for haldi, sangeet, reception & wedding functions Semi-stitched pattern ensures easy waist and length adjustments Designed for customers seeking a mix of style and comfort",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 118,
        name: "CHIKUDI-B Collection - Style 3",
        category: "lehenga",
        price: 11446,
        originalPrice: 14307,
        image: "040. CHIKUDI-B/CHIKUDI-B3.jpeg",
        description: "Fashionable Gown-style lehenga for a modern festive look Made with soft Passion Print fabric for smooth movement Net dupatta adds an elegant, lightweight finishing touch Embellished with Jari–Jarkan work for festive shine Perfect for haldi, sangeet, reception & wedding functions Semi-stitched pattern ensures easy waist and length adjustments Designed for customers seeking a mix of style and comfort",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 119,
        name: "GEHNA Collection - Style 1",
        category: "lehenga",
        price: 9912,
        originalPrice: 12390,
        image: "041. GEHNA/GEHNA-A1.jpeg",
        description: "Crafted from luxurious velvet fabric for a rich and royal appearance Embellished with intricate Jari, Jarkan & thread embroidery Elegant net dupatta enhances the bridal look Perfect for weddings, receptions, and festive occasions Semi-stitched design supports easy customization Comfortable regular fit suitable for long event hours Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 120,
        name: "ROYAL Collection - Style 1",
        category: "lehenga",
        price: 5428,
        originalPrice: 6785,
        image: "042. ROYAL/ROYAL-A1.jpeg",
        description: "Made from premium velvet fabric for a rich, royal appearance Detailed with Jari, Jarkan, and thread embroidery Comes with a soft net dupatta adding graceful elegance Ideal for weddings, receptions, and festive celebrations Semi-stitched design ensures easy customization and fitting Regular fit provides comfort for long functions A perfect blend of traditional craftsmanship and modern bridal style",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 121,
        name: "ROYAL Collection - Style 2",
        category: "lehenga",
        price: 5428,
        originalPrice: 6785,
        image: "042. ROYAL/ROYAL-A2.jpeg",
        description: "Crafted from luxurious velvet fabric for a rich and royal appearance Embellished with intricate Jari, Jarkan & thread embroidery Elegant net dupatta enhances the bridal look Perfect for weddings, receptions, and festive occasions Semi-stitched design supports easy customization Comfortable regular fit suitable for long event hours Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 122,
        name: "ROYAL Collection - Style 3",
        category: "lehenga",
        price: 5428,
        originalPrice: 6785,
        image: "042. ROYAL/ROYAL-A3.jpeg",
        description: "Crafted from luxurious velvet fabric for a rich and royal appearance Embellished with intricate Jari, Jarkan & thread embroidery Elegant net dupatta enhances the bridal look Perfect for weddings, receptions, and festive occasions Semi-stitched design supports easy customization Comfortable regular fit suitable for long event hours Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 123,
        name: "ROYAL Collection - Style 4",
        category: "lehenga",
        price: 5428,
        originalPrice: 6785,
        image: "042. ROYAL/ROYAL-A4.jpeg",
        description: "Crafted from luxurious velvet fabric for a rich and royal appearance Embellished with intricate Jari, Jarkan & thread embroidery Elegant net dupatta enhances the bridal look Perfect for weddings, receptions, and festive occasions Semi-stitched design supports easy customization Comfortable regular fit suitable for long event hours Blends traditional craftsmanship with modern bridal aesthetics",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 124,
        name: "MODERN-A Collection - Style 1",
        category: "lehenga",
        price: 8024,
        originalPrice: 10030,
        image: "043. MODERN-A/MODERN-A1.jpeg",
        description: "Made from premium Italian silk fabric for a smooth and elegant drape Decorated with intricate Jari, Jarkan & thread embroidery Comes with a soft net dupatta to complete the bridal look Ideal for weddings, receptions, and grand festive functions Semi-stitched design allows easy customization for perfect fitting Lightweight fabric ensures comfort during long wedding events Blends modern bridal fashion with traditional handcrafted detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 125,
        name: "MODERN-A Collection - Style 2",
        category: "lehenga",
        price: 8024,
        originalPrice: 10030,
        image: "043. MODERN-A/MODERN-A2.jpeg",
        description: "Made from premium Italian silk fabric for a smooth and elegant drape Decorated with intricate Jari, Jarkan & thread embroidery Comes with a soft net dupatta to complete the bridal look Ideal for weddings, receptions, and grand festive functions Semi-stitched design allows easy customization for perfect fitting Lightweight fabric ensures comfort during long wedding events Blends modern bridal fashion with traditional handcrafted detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 126,
        name: "TEEN KERI Collection - Style 1",
        category: "lehenga",
        price: 9263,
        originalPrice: 11578,
        image: "045. TEEN KERI/TEEN KERI-A1.jpeg",
        description: "Crafted from premium Italian silk for a rich and elegant drape Features heavy Girlish lehenga work with Jari, Thread & Jarkan detailing Comes with a soft net dupatta for a graceful bridal appearance Perfect for receptions, festive events, and special functions Semi-stitched design supports easy customization and ideal fitting Lightweight material ensures comfort for long celebrations Combines modern bridal style with fine traditional craftsmanship",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 127,
        name: "TEEN KERI Collection - Style 2",
        category: "lehenga",
        price: 9263,
        originalPrice: 11578,
        image: "045. TEEN KERI/TEEN KERI-A2.jpeg",
        description: "Crafted from premium Italian silk for a rich and elegant drape Features heavy Girlish lehenga work with Jari, Thread & Jarkan detailing Comes with a soft net dupatta for a graceful bridal appearance Perfect for receptions, festive events, and special functions Semi-stitched design supports easy customization and ideal fitting Lightweight material ensures comfort for long celebrations Combines modern bridal style with fine traditional craftsmanship",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 128,
        name: "TEEN KERI Collection - Style 3",
        category: "lehenga",
        price: 9263,
        originalPrice: 11578,
        image: "045. TEEN KERI/TEEN KERI-A3.jpeg",
        description: "Crafted from premium Italian silk for a rich and elegant drape Features heavy Girlish lehenga work with Jari, Thread & Jarkan detailing Comes with a soft net dupatta for a graceful bridal appearance Perfect for receptions, festive events, and special functions Semi-stitched design supports easy customization and ideal fitting Lightweight material ensures comfort for long celebrations Combines modern bridal style with fine traditional craftsmanship",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 129,
        name: "TEEN KERI Collection - Style 4",
        category: "lehenga",
        price: 9263,
        originalPrice: 11578,
        image: "045. TEEN KERI/TEEN KERI-A4.jpeg",
        description: "Crafted from premium Italian silk for a rich and elegant drape Features heavy Girlish lehenga work with Jari, Thread & Jarkan detailing Comes with a soft net dupatta for a graceful bridal appearance Perfect for receptions, festive events, and special functions Semi-stitched design supports easy customization and ideal fitting Lightweight material ensures comfort for long celebrations Combines modern bridal style with fine traditional craftsmanship",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 130,
        name: "SRIVALLI-A Collection - Style 1",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "046. SRIVALLI-A/SRIVALLI-A1.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Rani colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 131,
        name: "SRIVALLI-A Collection - Style 2",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "046. SRIVALLI-A/SRIVALLI-A2.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Red colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 132,
        name: "SRIVALLI-A Collection - Style 3",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "046. SRIVALLI-A/SRIVALLI-A3.jpeg",
        description: "Premium Velvet fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Maroon colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 133,
        name: "SATRANGI-A Collection - Style 1",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "047. SATRANGI-A/SATRANGI-A1.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 134,
        name: "SATRANGI-A Collection - Style 2",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "047. SATRANGI-A/SATRANGI-A2.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 135,
        name: "SATRANGI-A Collection - Style 3",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "047. SATRANGI-A/SATRANGI-A3.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 136,
        name: "SATRANGI-A Collection - Style 4",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "047. SATRANGI-A/SATRANGI-A4.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 137,
        name: "MANNAT-A Collection - Style 1",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "048. MANNAT-A/MANNAT-A1.jpeg",
        description: "Crafted from premium Italian Silk fabric for a smooth texture and elegant drape Adorned with classic zari work that enhances the traditional bridal look Comes with a double dupatta set, including a graceful net dupatta Designed in a Bridal pattern, perfect for weddings and grand ceremonies Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort while maintaining a graceful silhouette Ideal for weddings, bridal wear, and special festive occasions Recommended dry clean only to preserve fabric quality and work detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 138,
        name: "MANNAT-B Collection - Style 1",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "049. MANNAT-B/MANNAT-B1.jpeg",
        description: "Crafted from premium Italian Silk fabric for a smooth texture and elegant drape Adorned with classic zari work that enhances the traditional bridal look Comes with a double dupatta set, including a graceful net dupatta Designed in a Bridal pattern, perfect for weddings and grand ceremonies Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort while maintaining a graceful silhouette Ideal for weddings, bridal wear, and special festive occasions Recommended dry clean only to preserve fabric quality and work detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 139,
        name: "MANNAT-B Collection - Style 2",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "049. MANNAT-B/MANNAT-B2.jpeg",
        description: "Crafted from premium Italian Silk fabric for a smooth texture and elegant drape Adorned with classic zari work that enhances the traditional bridal look Comes with a double dupatta set, including a graceful net dupatta Designed in a Bridal pattern, perfect for weddings and grand ceremonies Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort while maintaining a graceful silhouette Ideal for weddings, bridal wear, and special festive occasions Recommended dry clean only to preserve fabric quality and work detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 140,
        name: "SRIVALLI-B Collection - Style 1",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "050. SRIVALLI-B/SRIVALLI-B1.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 141,
        name: "SRIVALLI-B Collection - Style 2",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "050. SRIVALLI-B/SRIVALLI-B2.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 142,
        name: "SRIVALLI-B Collection - Style 3",
        category: "lehenga",
        price: 12762,
        originalPrice: 15952,
        image: "050. SRIVALLI-B/SRIVALLI-B3.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 143,
        name: "MANNAT-C Collection - Style 1",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "051. MANNAT-C/MANNAT-C1.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Rani colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 144,
        name: "MANNAT-C Collection - Style 2",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "051. MANNAT-C/MANNAT-C2.jpeg",
        description: "Premium Italian Silk fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Rani colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 145,
        name: "MANNAT-C Collection - Style 3",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "051. MANNAT-C/MANNAT-C3.jpeg",
        description: "Premium Velvet fabric used in both lehenga and blouse for a rich and luxurious finish Beautifully detailed with intricate zari and embroidery work enhancing bridal elegance Comes with a dual dupatta set – one soft net dupatta and one rich velvet dupatta Elegant Bridal Maroon colour that gives a royal and traditional wedding look Designed as a Bridal Designer Lehenga, perfect for weddings and grand occasions Semi-stitched pattern allows easy customization up to size 44 inches Regular fit ensures comfort along with a graceful silhouette Ideal choice for weddings, bridal wear, and special ceremonial functions Requires dry clean only to maintain fabric quality and embroidery work",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 146,
        name: "MANNAT-D Collection - Style 1",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "052. MANNAT-D/MANNAT-D1.jpeg",
        description: "Crafted from premium Italian Silk fabric for a smooth texture and elegant drape Adorned with classic zari work that enhances the traditional bridal look Comes with a double dupatta set, including a graceful net dupatta Designed in a Bridal pattern, perfect for weddings and grand ceremonies Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort while maintaining a graceful silhouette Ideal for weddings, bridal wear, and special festive occasions Recommended dry clean only to preserve fabric quality and work detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 147,
        name: "MANNAT-D Collection - Style 2",
        category: "lehenga",
        price: 10779,
        originalPrice: 13473,
        image: "052. MANNAT-D/MANNAT-D2.jpeg",
        description: "Crafted from premium Italian Silk fabric for a smooth texture and elegant drape Adorned with classic zari work that enhances the traditional bridal look Comes with a double dupatta set, including a graceful net dupatta Designed in a Bridal pattern, perfect for weddings and grand ceremonies Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort while maintaining a graceful silhouette Ideal for weddings, bridal wear, and special festive occasions Recommended dry clean only to preserve fabric quality and work detailing",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 148,
        name: "DREAM-B Collection - Style 1",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "053. DREAM-B/DREAM-B1.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 149,
        name: "DREAM-B Collection - Style 2",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "053. DREAM-B/DREAM-B2.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 150,
        name: "DREAM-B Collection - Style 3",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "053. DREAM-B/DREAM-B3.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 151,
        name: "DREAM-B Collection - Style 4",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "053. DREAM-B/DREAM-B4.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 152,
        name: "DREAM-D Collection - Style 1",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "054. DREAM-D/DREAM-D1.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 153,
        name: "DREAM-D Collection - Style 2",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "054. DREAM-D/DREAM-D2.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 154,
        name: "DREAM-D Collection - Style 3",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "054. DREAM-D/DREAM-D3.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 155,
        name: "DREAM-D Collection - Style 4",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "054. DREAM-D/DREAM-D4.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 156,
        name: "DREAM-A Collection - Style 1",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "055. DREAM-A/DREAM-A1.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 157,
        name: "DREAM-A Collection - Style 2",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "055. DREAM-A/DREAM-A2.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 158,
        name: "DREAM-A Collection - Style 3",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "055. DREAM-A/DREAM-A3.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 159,
        name: "DREAM-A Collection - Style 4",
        category: "lehenga",
        price: 11487,
        originalPrice: 14358,
        image: "055. DREAM-A/DREAM-A4.jpeg",
        description: "Crafted from high-quality Velvet & Rapier fabric for a rich finish Heavy embroidery adds a luxurious and grand bridal feel Dual Dupatta Set: Net dupatta for elegance + Velvet dupatta for royal look Ideal for weddings and premium traditional occasions Semi-stitched lehenga fits perfectly with alteration flexibility Durable craftsmanship designed for long hours of wear Available in vibrant bridal shades for a stunning appearance",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 160,
        name: "COSMIC-B Collection - Style 1",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B1.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 161,
        name: "COSMIC-B Collection - Style 2",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B2.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 162,
        name: "COSMIC-B Collection - Style 3",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B3.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 163,
        name: "COSMIC-B Collection - Style 4",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B4.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 164,
        name: "COSMIC-B Collection - Style 5",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B5.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 165,
        name: "COSMIC-B Collection - Style 6",
        category: "lehenga",
        price: 10189,
        originalPrice: 12736,
        image: "056. COSMIC-B/COSMIC-B6.jpeg",
        description: "Made from premium net fabric, giving a lightweight and flowy appearance Decorated with sequence and beads work for a sparkling, glamorous look Designed in a stylish pattern, perfect for modern ethnic wear Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort along with elegant drape Ideal choice for receptions and party occasions Easy maintenance with dry clean only care",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 166,
        name: "GULAL-B Collection - Style 1",
        category: "lehenga",
        price: 11163,
        originalPrice: 13953,
        image: "057. GULAL-B/GULAL-B1.jpeg",
        description: "Crafted from premium net fabric for a lightweight and elegant look Beautifully embellished with beads work that adds sparkle and charm Designed in a stylish pattern, perfect for modern festive styling Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort with a graceful silhouette Ideal for receptions, festive occasions, and celebration wear Easy to maintain with dry clean only care instruction",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 167,
        name: "GULAL-B Collection - Style 2",
        category: "lehenga",
        price: 11163,
        originalPrice: 13953,
        image: "057. GULAL-B/GULAL-B2.jpeg",
        description: "Crafted from premium net fabric for a lightweight and elegant look Beautifully embellished with beads work that adds sparkle and charm Designed in a stylish pattern, perfect for modern festive styling Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort with a graceful silhouette Ideal for receptions, festive occasions, and celebration wear Easy to maintain with dry clean only care instruction",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 168,
        name: "GULAL-B Collection - Style 3",
        category: "lehenga",
        price: 11163,
        originalPrice: 13953,
        image: "057. GULAL-B/GULAL-B3.jpeg",
        description: "Crafted from premium net fabric for a lightweight and elegant look Beautifully embellished with beads work that adds sparkle and charm Designed in a stylish pattern, perfect for modern festive styling Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort with a graceful silhouette Ideal for receptions, festive occasions, and celebration wear Easy to maintain with dry clean only care instruction",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 169,
        name: "GULAL-B Collection - Style 4",
        category: "lehenga",
        price: 11163,
        originalPrice: 13953,
        image: "057. GULAL-B/GULAL-B4.jpeg",
        description: "Crafted from premium net fabric for a lightweight and elegant look Beautifully embellished with beads work that adds sparkle and charm Designed in a stylish pattern, perfect for modern festive styling Semi-stitched design allows easy customization up to size 44 Regular fit ensures comfort with a graceful silhouette Ideal for receptions, festive occasions, and celebration wear Easy to maintain with dry clean only care instruction",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 170,
        name: "SATRANGI-B Collection - Style 1",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "060. SATRANGI-B/SATRANGI-B1.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 171,
        name: "SATRANGI-B Collection - Style 2",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "060. SATRANGI-B/SATRANGI-B2.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
    {
        id: 172,
        name: "SATRANGI-B Collection - Style 3",
        category: "lehenga",
        price: 8614,
        originalPrice: 10767,
        image: "060. SATRANGI-B/SATRANGI-B3.jpeg",
        description: "Crafted from premium Jharkan silk fabric that offers a rich texture and elegant finish Beautifully enhanced with fine Zari and thread embroidery for a refined festive look Paired with a graceful Tebi dupatta that adds charm and sophistication Perfect choice for festive wear, receptions, and special celebrations Semi-stitched design allows easy customization up to size 44 Lightweight yet grand, ensuring comfort during long hours of wear A seamless blend of traditional craftsmanship with modern ethnic styling",
        specifications: {
            gsm: "320-380",
            material: "Premium Fabric with Embroidery",
            width: "44 inches",
            colors: "As per stock availability",
            origin: "India"
        },
        supplier: "BABISHA Collections",
        rating: 4.5,
        reviews: 100,
        onSale: true,
        savings: 20
    },
];


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize immediately
    initializeApp();
    initializeInteractiveFeatures();
    
    // Load product details if on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetails();
    }
    
    // Also try after a short delay as fallback
    setTimeout(function() {
        console.log('Fallback initialization triggered');
        const currentPage = getCurrentPage();
        if (currentPage === 'products') {
            if (fabricData && fabricData.length > 0 && (!filteredFabrics || filteredFabrics.length === 0)) {
                filteredFabrics = [...fabricData];
            }
            displayFabrics();
        }
    }, 500);
});

// Initialize App Function
function initializeApp() {
    console.log('Initializing app...');
    fabricData = [...sampleFabrics];
    filteredFabrics = [...fabricData];
    
    // Make globally accessible for debugging
    window.sampleFabrics = sampleFabrics;
    window.fabricData = fabricData;
    window.filteredFabrics = filteredFabrics;
    window.displayFabrics = displayFabrics;
    
    console.log('Fabric data loaded:', fabricData.length, 'fabrics');
    console.log('Sample fabrics array length:', sampleFabrics.length);
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    
    switch(currentPage) {
        case 'products':
            console.log('Initializing products page...');
            initializeProductsPage();
            break;
        case 'index':
            console.log('Initializing home page...');
            initializeHomePage();
            break;
        default:
            console.log('Initializing general page...');
            initializeGeneralPage();
    }
}

// Get Current Page
function getCurrentPage() {
    const path = window.location.pathname;
    const href = window.location.href;
    console.log('Checking page - pathname:', path, 'href:', href);
    if (path.includes('products.html') || href.includes('products.html')) return 'products';
    if (path.includes('index.html') || path === '/' || href.includes('index.html')) return 'index';
    return 'general';
}

// Initialize Products Page
async function initializeProductsPage() {
    console.log('Setting up products page...');
    
    // Try to load products from Supabase first
    if (typeof window.initializeProducts === 'function') {
        console.log('Loading products from Supabase...');
        await window.initializeProducts();
    }
    
    // Ensure filteredFabrics is initialized with all products
    if (filteredFabrics.length === 0) {
        filteredFabrics = [...fabricData];
    }
    
    initializeFilters();
    initializeSearch();
    initializeSorting();
    initializePagination();
    initializeMobileFilterSidebar();
    updateResultsCount();
    
    // Handle URL parameters first (this will call displayFabrics if needed)
    const hasURLParams = handleURLParameters();
    
    // ALWAYS ensure we have data and display it
    console.log('hasURLParams:', hasURLParams);
    console.log('filteredFabrics.length:', filteredFabrics ? filteredFabrics.length : 'undefined');
    console.log('fabricData.length:', fabricData ? fabricData.length : 'undefined');
    
    // Ensure fabricData is initialized
    if (!fabricData || fabricData.length === 0) {
        console.log('fabricData is empty, initializing from sampleFabrics');
        if (sampleFabrics && sampleFabrics.length > 0) {
            fabricData = [...sampleFabrics];
            console.log('fabricData initialized with', fabricData.length, 'fabrics');
        }
    }
    
    // Only display fabrics if handleURLParameters didn't already do it
    if (!hasURLParams) {
        console.log('No URL parameters, displaying all fabrics...');
        
        // Ensure filteredFabrics is set
        if (!filteredFabrics || filteredFabrics.length === 0) {
            console.log('filteredFabrics is empty, resetting from fabricData');
            filteredFabrics = [...fabricData];
        }
        
        console.log('About to call displayFabrics with', filteredFabrics.length, 'fabrics');
        displayFabrics();
    } else {
        // URL params were handled, but verify displayFabrics was called
        console.log('URL params handled, checking if fabrics are displayed...');
        const fabricGrid = document.getElementById('fabricGrid');
        if (fabricGrid && (!fabricGrid.innerHTML || fabricGrid.innerHTML.trim() === '' || 
            fabricGrid.innerHTML.includes('Fabric cards will be dynamically generated'))) {
            console.log('Grid is still empty after handleURLParameters, calling displayFabrics again');
            displayFabrics();
        }
    }
}

// Initialize Mobile Filter Sidebar Toggle
function initializeMobileFilterSidebar() {
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (!filterSidebar) return;
    
    const filterTitle = filterSidebar.querySelector('h5');
    if (!filterTitle) return;
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add click handler to toggle sidebar
        filterTitle.style.cursor = 'pointer';
        filterTitle.addEventListener('click', function() {
            filterSidebar.classList.toggle('collapsed');
        });
        
        // Initially collapse on mobile
        filterSidebar.classList.add('collapsed');
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow && !filterTitle.hasAttribute('data-mobile-initialized')) {
            filterTitle.style.cursor = 'pointer';
            filterTitle.addEventListener('click', function() {
                filterSidebar.classList.toggle('collapsed');
            });
            filterTitle.setAttribute('data-mobile-initialized', 'true');
        }
    });
}

// Initialize Home Page
function initializeHomePage() {
    // Home page specific initialization
    console.log('Home page initialized');
}

// Initialize General Page
function initializeGeneralPage() {
    // General page initialization
    console.log('General page initialized');
}

// Display Fabrics
function displayFabrics() {
    console.log('Display fabrics called');
    const fabricGrid = document.getElementById('fabricGrid');
    console.log('Fabric grid element:', fabricGrid);
    
    if (!fabricGrid) {
        console.error('Fabric grid element not found!');
        return;
    }
    
    // Ensure we have products to display
    if (!filteredFabrics || filteredFabrics.length === 0) {
        console.warn('No filtered fabrics, using all fabric data');
        if (fabricData && fabricData.length > 0) {
            filteredFabrics = [...fabricData];
        } else if (sampleFabrics && sampleFabrics.length > 0) {
            fabricData = [...sampleFabrics];
            filteredFabrics = [...fabricData];
        } else {
            console.error('No fabric data available!');
            fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-danger">No products available. Please check the console for errors.</p></div>';
            return;
        }
    }
    
    console.log('Displaying fabrics:', filteredFabrics.length);
    
    fabricGrid.innerHTML = '';
    
    if (filteredFabrics.length === 0) {
        fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No products found matching your criteria.</p></div>';
        updateResultsCount();
        currentPageNumber = 1;
        updatePagination();
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage);
    if (currentPageNumber > totalPages) {
        currentPageNumber = totalPages;
    }
    if (currentPageNumber < 1) {
        currentPageNumber = 1;
    }
    
    // Get items for current page
    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageFabrics = filteredFabrics.slice(startIndex, endIndex);
    
    console.log('Total fabrics:', filteredFabrics.length);
    console.log('Current page:', currentPageNumber);
    console.log('Items per page:', itemsPerPage);
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
    console.log('Fabrics for current page:', currentPageFabrics.length);
    
    if (currentPageFabrics.length === 0) {
        console.warn('No fabrics to display for current page!');
        fabricGrid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No products found for this page.</p></div>';
        updateResultsCount();
        updatePagination();
        return;
    }
    
    console.log('About to create', currentPageFabrics.length, 'fabric cards');
    
    currentPageFabrics.forEach((fabric, index) => {
        try {
            console.log(`Creating card ${index + 1}/${currentPageFabrics.length} for:`, fabric.name);
            const fabricCard = createFabricCard(fabric);
            if (fabricCard) {
                console.log('Card created successfully, appending to grid...');
                fabricGrid.appendChild(fabricCard);
                console.log('Card appended. Grid now has', fabricGrid.children.length, 'children');
                
                // Add image error handling after card is added to DOM
                const img = fabricCard.querySelector('img');
                if (img) {
                    // Log image source for debugging
                    console.log('Setting image source:', fabric.image, 'Full path:', img.src);
                    
                    img.addEventListener('error', function() {
                        console.error('Image failed to load:', this.src);
                        console.error('Original path:', fabric.image);
                        // Try alternative paths
                        const originalPath = fabric.image;
                        if (!originalPath.startsWith('/') && !originalPath.startsWith('http')) {
                            // Try with leading slash
                            this.src = '/' + originalPath;
                            console.log('Trying with leading slash:', this.src);
                        } else if (originalPath.startsWith('images/')) {
                            // Try without images/ prefix
                            this.src = '/' + originalPath;
                            console.log('Trying absolute path:', this.src);
                        }
                    });
                    
                    img.addEventListener('load', function() {
                        console.log('✓ Image loaded successfully:', this.src);
                    });
                } else {
                    console.error('Image element not found in fabric card for:', fabric.name);
                }
            } else {
                console.error('Failed to create fabric card for:', fabric);
            }
        } catch (error) {
            console.error('Error creating fabric card for', fabric.name, ':', error);
            console.error('Error stack:', error.stack);
        }
    });
    
    console.log('Finished creating cards. Total children in grid:', fabricGrid.children.length);
    
    console.log('Fabric cards created, updating results...');
    updateResultsCount();
    updatePagination();
}

// Create Fabric Card
function createFabricCard(fabric) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    const savingsText = fabric.onSale ? 
        `<span class="badge bg-danger me-2">Save ${fabric.savings}%</span>` : '';
    
    col.innerHTML = `
        <div class="fabric-card h-100">
            <div class="fabric-image position-relative">
                ${savingsText}
                <img src="${fabric.image}" alt="${fabric.name}" class="img-fluid" loading="lazy">
                <div class="product-overlay">
                    <div class="quick-actions">
                        <button class="btn btn-light btn-sm" onclick="viewFabricDetails(${fabric.id})">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="orderNow(${fabric.id})">
                            <i class="fab fa-whatsapp me-1"></i>Order Now
                        </button>
                    </div>
                </div>
            </div>
            <div class="fabric-info p-3">
                <h5 class="fabric-name mb-2">${fabric.name}</h5>
                <div class="fabric-rating mb-2">
                    <div class="stars d-inline-block">
                        ${generateStars(fabric.rating)}
                    </div>
                    <small class="text-muted ms-2">${fabric.reviews} reviews</small>
                </div>
                <div class="fabric-price mb-3">
                    <span class="current-price h5 text-primary">₹${fabric.price.toLocaleString()}/piece</span>
                    ${fabric.onSale ? `<span class="original-price text-muted text-decoration-line-through ms-2">₹${fabric.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <!-- Minimal details - View Details button to see all info -->
                <div class="fabric-actions">
                    <button class="btn btn-primary btn-sm w-100" onclick="viewFabricDetails(${fabric.id})">
                        <i class="fas fa-eye me-1"></i>View Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// Initialize Filters
function initializeFilters() {
    console.log('=== initializeFilters() called ===');
    // Verify Apply button exists and hide it initially
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (!applyBtn) {
        console.error('❌ Apply Filters button NOT found! Check HTML structure.');
        console.log('Searching for button with class...');
        const btnByClass = document.querySelector('.apply-filters');
        console.log('Button by class:', btnByClass);
    } else {
        console.log('✅ Apply Filters button found in DOM');
        console.log('Button element:', applyBtn);
        // Ensure button is hidden initially using class
        applyBtn.classList.add('hidden');
        applyBtn.style.display = 'none';
        console.log('Button hidden initially');
    }
    
    const filterInputs = document.querySelectorAll('.filter-option input[type="checkbox"]');
    console.log('Found', filterInputs.length, 'filter checkboxes');
    
    filterInputs.forEach(input => {
        // Use click event instead of change for more reliable detection
        input.addEventListener('click', function() {
            console.log('✅ Checkbox clicked:', this.id, 'will be:', !this.checked);
            // Use setTimeout to ensure the checkbox state has updated
            setTimeout(function() {
                const clickedInput = input;
                console.log('Checkbox state after click:', clickedInput.id, 'checked:', clickedInput.checked);
                
                // Handle "All Fabrics" checkbox logic
                if (clickedInput.id === 'cat-all' && clickedInput.checked) {
                    // Uncheck all other category checkboxes
                    filterInputs.forEach(inp => {
                        if (inp.id !== 'cat-all') {
                            inp.checked = false;
                        }
                    });
                    // Show Apply button when "All Fabrics" is selected
                    console.log('All Fabrics selected, showing Apply button...');
                    showApplyButton();
                } else if (clickedInput.id !== 'cat-all' && clickedInput.checked) {
                    // Uncheck "All Fabrics" when a specific category is selected
                    const allCheckbox = document.getElementById('cat-all');
                    if (allCheckbox && allCheckbox.checked) {
                        allCheckbox.checked = false;
                        console.log('Unchecked All Fabrics programmatically');
                    }
                    // Show Apply button when a specific category is selected
                    console.log('Specific category selected, showing Apply button...');
                    showApplyButton();
                } else if (clickedInput.id !== 'cat-all' && !clickedInput.checked) {
                    // When unchecking a specific category, check if any category is still selected
                    const anyCategorySelected = Array.from(filterInputs).some(inp => 
                        inp.id !== 'cat-all' && inp.checked
                    );
                    if (!anyCategorySelected) {
                        // No specific category selected, check "All Fabrics"
                        const allCheckbox = document.getElementById('cat-all');
                        if (allCheckbox && !allCheckbox.checked) {
                            allCheckbox.checked = true;
                            console.log('No categories selected, checking All Fabrics');
                        }
                    }
                    // Show Apply button when unchecking a category
                    console.log('Category unchecked, showing Apply button...');
                    showApplyButton();
                } else if (clickedInput.id === 'cat-all' && !clickedInput.checked) {
                    // "All Fabrics" was unchecked - show button
                    console.log('All Fabrics unchecked, showing Apply button...');
                    showApplyButton();
                }
            }, 0);
        });
        
        // Also keep change event as backup
        input.addEventListener('change', function() {
            console.log('Change event fired for:', this.id);
            showApplyButton();
        });
    });
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        // Update maxPrice input when slider changes
        priceRange.addEventListener('input', function() {
            const maxPriceInput = document.getElementById('maxPrice');
            if (maxPriceInput) {
                maxPriceInput.value = this.value;
            }
            // Show Apply button instead of applying filters immediately
            showApplyButton();
        });
    }
    
    // Min price input
    const minPrice = document.getElementById('minPrice');
    if (minPrice) {
        minPrice.addEventListener('input', showApplyButton);
        minPrice.addEventListener('change', showApplyButton);
    }
    
    // Max price input
    const maxPrice = document.getElementById('maxPrice');
    if (maxPrice) {
        maxPrice.addEventListener('input', function() {
            // Sync with slider
            if (priceRange) {
                priceRange.value = this.value;
            }
            // Show Apply button instead of applying filters immediately
            showApplyButton();
        });
        maxPrice.addEventListener('change', showApplyButton);
    }
    
    // Update price range limits based on actual product prices
    updatePriceRangeLimits();
}

// Show Apply Filters Button
function showApplyButton() {
    console.log('=== showApplyButton() called ===');
    const applyBtn = document.getElementById('applyFiltersBtn');
    console.log('Button element found:', !!applyBtn);
    
    if (applyBtn) {
        // Remove hidden class and inline style
        applyBtn.classList.remove('hidden');
        applyBtn.removeAttribute('style');
        // Set display to block
        applyBtn.style.display = 'block';
        
        console.log('✅ Button display set to block');
        console.log('Button classes:', applyBtn.className);
        console.log('Computed display:', window.getComputedStyle(applyBtn).display);
        console.log('Button offsetHeight:', applyBtn.offsetHeight);
        console.log('Button offsetWidth:', applyBtn.offsetWidth);
        
        // Verify it's visible
        if (applyBtn.offsetHeight === 0) {
            console.warn('⚠️ Button has zero height, may be hidden by CSS');
            // Try force method
            applyBtn.style.setProperty('display', 'block', 'important');
        } else {
            console.log('✅ Button is visible!');
        }
    } else {
        console.error('❌ Apply Filters button NOT found in DOM!');
        // Try to find it with different selector
        const applyBtnAlt = document.querySelector('.apply-filters');
        if (applyBtnAlt) {
            console.log('✅ Found button with class selector');
            applyBtnAlt.classList.remove('hidden');
            applyBtnAlt.style.display = 'block';
        } else {
            console.error('❌ Button not found with class selector either');
            const allButtons = document.querySelectorAll('.filter-sidebar button');
            console.log('Available buttons in filter sidebar:', allButtons.length, allButtons);
        }
    }
}

// Hide Apply Filters Button
function hideApplyButton() {
    const applyBtn = document.getElementById('applyFiltersBtn');
    if (applyBtn) {
        applyBtn.classList.add('hidden');
        applyBtn.style.display = 'none';
        console.log('Apply Filters button hidden');
    }
}

// Apply Filters from Button Click
function applyFiltersFromButton() {
    console.log('=== applyFiltersFromButton() called ===');
    console.log('Applying filters...');
    applyFilters();
    hideApplyButton();
    console.log('Filters applied, button hidden');
}

// Apply Filters
function applyFilters() {
    console.log('=== applyFilters() called ===');
    const selectedCategories = getSelectedCategories();
    const priceRange = getPriceRange();
    
    console.log('Selected categories:', selectedCategories);
    console.log('Price range:', priceRange);
    console.log('Total fabrics before filter:', fabricData.length);
    
    // Separate category filters from fabric type filters
    const categoryFilters = [];
    const fabricTypeFilters = [];
    const fabricTypes = ['velvet', 'silk', 'cotton', 'linen', 'denim', 'organza', 'chiffon'];
    
    selectedCategories.forEach(selected => {
        if (fabricTypes.includes(selected.toLowerCase())) {
            fabricTypeFilters.push(selected.toLowerCase());
        } else {
            categoryFilters.push(selected);
        }
    });
    
    console.log('Category filters:', categoryFilters);
    console.log('Fabric type filters:', fabricTypeFilters);
    
    filteredFabrics = fabricData.filter(fabric => {
        // Check category match (lehenga, sarees, etc.)
        let categoryMatch = true;
        if (categoryFilters.length > 0) {
            categoryMatch = categoryFilters.includes(fabric.category);
        }
        
        // Check fabric type match (velvet, silk, cotton, etc.) in description or material
        let fabricTypeMatch = true;
        if (fabricTypeFilters.length > 0) {
            const description = (fabric.description || '').toLowerCase();
            const material = (fabric.specifications?.material || '').toLowerCase();
            const name = (fabric.name || '').toLowerCase();
            
            fabricTypeMatch = fabricTypeFilters.some(type => {
                return description.includes(type) || 
                       material.includes(type) || 
                       name.includes(type);
            });
        }
        
        const priceMatch = fabric.price >= priceRange.min && fabric.price <= priceRange.max;
        
        const matches = (categoryMatch && fabricTypeMatch && priceMatch);
        
        if (!matches) {
            if (!categoryMatch) {
                console.log(`Fabric ${fabric.id} (${fabric.name}) - category "${fabric.category}" not in selected:`, categoryFilters);
            }
            if (!fabricTypeMatch) {
                console.log(`Fabric ${fabric.id} (${fabric.name}) - fabric type not found in description/material`);
            }
            if (!priceMatch) {
                console.log(`Fabric ${fabric.id} (${fabric.name}) - price ${fabric.price} not in range:`, priceRange);
            }
        }
        
        return matches;
    });
    
    console.log('Filtered fabrics count:', filteredFabrics.length);
    console.log('Filtered fabrics:', filteredFabrics.map(f => ({id: f.id, name: f.name, category: f.category, price: f.price})));
    
    // If category has fewer products, add similar-priced products
    const MIN_PRODUCTS_THRESHOLD = 6; // Minimum products to show
    if (filteredFabrics.length > 0 && filteredFabrics.length < MIN_PRODUCTS_THRESHOLD) {
        console.log(`Only ${filteredFabrics.length} products found, adding similar-priced products...`);
        
        // Calculate average price of filtered products
        const avgPrice = filteredFabrics.reduce((sum, f) => sum + f.price, 0) / filteredFabrics.length;
        const priceTolerance = avgPrice * 0.30; // 30% price tolerance
        const minPrice = avgPrice - priceTolerance;
        const maxPrice = avgPrice + priceTolerance;
        
        console.log(`Average price: ${avgPrice}, Price range: ${minPrice} - ${maxPrice}`);
        
        // Get IDs of already filtered products to avoid duplicates
        const filteredIds = new Set(filteredFabrics.map(f => f.id));
        
        // Find products with similar prices that aren't already in the filtered list
        const similarPricedProducts = fabricData.filter(fabric => {
            // Skip if already in filtered results
            if (filteredIds.has(fabric.id)) {
                return false;
            }
            
            // Check if price is within tolerance range
            const priceMatch = fabric.price >= minPrice && fabric.price <= maxPrice;
            
            // Also check if price is within the current price range filter
            const priceInRange = fabric.price >= priceRange.min && fabric.price <= priceRange.max;
            
            return priceMatch && priceInRange;
        });
        
        // Sort by price difference (closest first)
        similarPricedProducts.sort((a, b) => {
            const diffA = Math.abs(a.price - avgPrice);
            const diffB = Math.abs(b.price - avgPrice);
            return diffA - diffB;
        });
        
        // Add similar products to fill up to threshold
        const neededCount = MIN_PRODUCTS_THRESHOLD - filteredFabrics.length;
        const productsToAdd = similarPricedProducts.slice(0, neededCount);
        
        console.log(`Adding ${productsToAdd.length} similar-priced products`);
        filteredFabrics = [...filteredFabrics, ...productsToAdd];
        
        // Sort by price to keep them organized
        filteredFabrics.sort((a, b) => a.price - b.price);
        
        console.log(`Total products after adding similar: ${filteredFabrics.length}`);
    }
    
    // Reset to first page when filters change
    currentPageNumber = 1;
    updateResultsCount();
    displayFabrics();
    console.log('Filters applied and display updated');
}

// Get Selected Categories
function getSelectedCategories() {
    const selected = [];
    const categoryInputs = document.querySelectorAll('.filter-option input[type="checkbox"]:checked');
    
    console.log('All checked checkboxes:', Array.from(categoryInputs).map(inp => ({id: inp.id, value: inp.value, checked: inp.checked})));
    
    // Check if "All Fabrics" is selected
    const allCheckbox = document.getElementById('cat-all');
    if (allCheckbox && allCheckbox.checked) {
        console.log('"All Fabrics" is checked, returning empty array');
        return []; // Return empty array to show all categories
    }
    
    categoryInputs.forEach(input => {
        if (input.value !== 'all') {
            selected.push(input.value);
            console.log('Added category to selection:', input.value);
        }
    });
    
    // If no categories are selected via checkboxes, check URL parameter
    if (selected.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category === 'lehengas') {
            selected.push('lehenga');
        } else if (category === 'sarees') {
            selected.push('sarees');
        } else if (category) {
            selected.push(category);
        }
    }
    
    console.log('Final selected categories:', selected);
    return selected;
}

// Get Price Range
function getPriceRange() {
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    return {
        min: parseInt(minPrice?.value) || 0,
        max: parseInt(maxPrice?.value) || 15000
    };
}

// Update Price Range Limits
function updatePriceRangeLimits() {
    if (!fabricData || fabricData.length === 0) return;
    
    // Find min and max prices from actual products
    const prices = fabricData.map(f => f.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Update slider and inputs
    const priceRangeSlider = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceRangeSlider) {
        priceRangeSlider.min = Math.floor(minPrice * 0.8); // 20% below minimum
        priceRangeSlider.max = Math.ceil(maxPrice * 1.1); // 10% above maximum
        if (!maxPriceInput || !maxPriceInput.value || maxPriceInput.value === '5000') {
            priceRangeSlider.value = maxPrice;
        }
    }
    
    if (minPriceInput) {
        minPriceInput.min = Math.floor(minPrice * 0.8);
        minPriceInput.max = Math.ceil(maxPrice * 1.1);
        if (!minPriceInput.value || minPriceInput.value === '500') {
            minPriceInput.value = Math.floor(minPrice * 0.8);
        }
    }
    
    if (maxPriceInput) {
        maxPriceInput.min = Math.floor(minPrice * 0.8);
        maxPriceInput.max = Math.ceil(maxPrice * 1.1);
        if (!maxPriceInput.value || maxPriceInput.value === '5000') {
            maxPriceInput.value = maxPrice;
            // Sync slider
            if (priceRangeSlider) {
                priceRangeSlider.value = maxPrice;
            }
        }
    }
}

// Initialize Search
function initializeSearch() {
    const searchInput = document.getElementById('fabricSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle Search
function handleSearch() {
    const searchTerm = document.getElementById('fabricSearch').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredFabrics = [...fabricData];
    } else {
        filteredFabrics = fabricData.filter(fabric => 
            fabric.name.toLowerCase().includes(searchTerm) ||
            fabric.description.toLowerCase().includes(searchTerm) ||
            fabric.category.toLowerCase().includes(searchTerm)
        );
        
        // If search has fewer products, add similar-priced products
        const MIN_PRODUCTS_THRESHOLD = 6; // Minimum products to show
        if (filteredFabrics.length > 0 && filteredFabrics.length < MIN_PRODUCTS_THRESHOLD) {
            console.log(`Only ${filteredFabrics.length} products found in search, adding similar-priced products...`);
            
            // Calculate average price of filtered products
            const avgPrice = filteredFabrics.reduce((sum, f) => sum + f.price, 0) / filteredFabrics.length;
            const priceTolerance = avgPrice * 0.30; // 30% price tolerance
            const minPrice = avgPrice - priceTolerance;
            const maxPrice = avgPrice + priceTolerance;
            
            console.log(`Average price: ${avgPrice}, Price range: ${minPrice} - ${maxPrice}`);
            
            // Get IDs of already filtered products to avoid duplicates
            const filteredIds = new Set(filteredFabrics.map(f => f.id));
            
            // Get current price range
            const priceRange = getPriceRange();
            
            // Find products with similar prices that aren't already in the filtered list
            const similarPricedProducts = fabricData.filter(fabric => {
                // Skip if already in filtered results
                if (filteredIds.has(fabric.id)) {
                    return false;
                }
                
                // Check if price is within tolerance range
                const priceMatch = fabric.price >= minPrice && fabric.price <= maxPrice;
                
                // Also check if price is within the current price range filter
                const priceInRange = fabric.price >= priceRange.min && fabric.price <= priceRange.max;
                
                return priceMatch && priceInRange;
            });
            
            // Sort by price difference (closest first)
            similarPricedProducts.sort((a, b) => {
                const diffA = Math.abs(a.price - avgPrice);
                const diffB = Math.abs(b.price - avgPrice);
                return diffA - diffB;
            });
            
            // Add similar products to fill up to threshold
            const neededCount = MIN_PRODUCTS_THRESHOLD - filteredFabrics.length;
            const productsToAdd = similarPricedProducts.slice(0, neededCount);
            
            console.log(`Adding ${productsToAdd.length} similar-priced products to search results`);
            filteredFabrics = [...filteredFabrics, ...productsToAdd];
            
            // Sort by price to keep them organized
            filteredFabrics.sort((a, b) => a.price - b.price);
            
            console.log(`Total products after adding similar: ${filteredFabrics.length}`);
        }
    }
    
    currentPageNumber = 1;
    displayFabrics();
}

// Initialize Sorting
function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
}

// Apply Sorting
function applySorting() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'price-low':
            filteredFabrics.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredFabrics.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredFabrics.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredFabrics.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredFabrics.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order
            break;
    }
    
    currentPageNumber = 1;
    displayFabrics();
}

// Initialize Pagination
function initializePagination() {
    // Simple pagination implementation
    updatePagination();
}

// Update Pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredFabrics.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    // Ensure currentPageNumber is within valid range
    if (currentPageNumber > totalPages) {
        currentPageNumber = totalPages;
    }
    if (currentPageNumber < 1) {
        currentPageNumber = 1;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPageNumber > 1) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1" onclick="goToPage(${currentPageNumber - 1})" title="Previous">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
    }
    
    // Always show first page
    if (currentPageNumber > 3) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${currentPageNumber === 1 ? 'active' : ''}" onclick="goToPage(1)">
                1
            </button>
        `;
        if (currentPageNumber > 4) {
            paginationHTML += `<span class="me-1" style="padding: 0.375rem 0.5rem;">...</span>`;
        }
    }
    
    // Show pages around current page
    const startPage = Math.max(1, currentPageNumber - 2);
    const endPage = Math.min(totalPages, currentPageNumber + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPageNumber ? 'active' : '';
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${isActive}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Always show last page
    if (currentPageNumber < totalPages - 2) {
        if (currentPageNumber < totalPages - 3) {
            paginationHTML += `<span class="me-1" style="padding: 0.375rem 0.5rem;">...</span>`;
        }
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1 ${currentPageNumber === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">
                ${totalPages}
            </button>
        `;
    }
    
    // Next button
    if (currentPageNumber < totalPages) {
        paginationHTML += `
            <button class="btn btn-outline-primary btn-sm me-1" onclick="goToPage(${currentPageNumber + 1})" title="Next">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }
    
    pagination.innerHTML = paginationHTML;
    
    // Update showing range
    updateShowingRange();
}

// Update Showing Range
function updateShowingRange() {
    const showingRange = document.getElementById('showingRange');
    if (!showingRange) return;
    
    const start = (currentPageNumber - 1) * itemsPerPage + 1;
    const end = Math.min(currentPageNumber * itemsPerPage, filteredFabrics.length);
    
    showingRange.textContent = `${start}-${end}`;
}

// Go to Page
function goToPage(page) {
    currentPageNumber = page;
    displayFabrics();
    updatePagination();
    
    // Scroll to top of products
    const productsSection = document.querySelector('.products-container');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update Results Count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const totalResults = document.getElementById('totalResults');
    
    const count = filteredFabrics ? filteredFabrics.length : 0;
    
    if (resultsCount) {
        resultsCount.textContent = `${count} fabrics found`;
    }
    
    if (totalResults) {
        totalResults.textContent = count.toString();
    }
    
    // showingRange is now updated in updateShowingRange()
    updateShowingRange();
}

// Handle URL Parameters
function handleURLParameters() {
    console.log('handleURLParameters called');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const collection = urlParams.get('collection');
    const occasion = urlParams.get('occasion');
    const fabric = urlParams.get('fabric');
    
    console.log('URL params - category:', category, 'collection:', collection, 'occasion:', occasion, 'fabric:', fabric);
    console.log('fabricData length:', fabricData ? fabricData.length : 'undefined');
    
    // Ensure fabricData is initialized
    if (!fabricData || fabricData.length === 0) {
        console.log('fabricData is empty, initializing from sampleFabrics');
        if (sampleFabrics && sampleFabrics.length > 0) {
            fabricData = [...sampleFabrics];
            console.log('fabricData initialized with', fabricData.length, 'fabrics');
        } else {
            console.error('sampleFabrics is also empty!');
            return false;
        }
    }
    
    // If no category parameter, don't display yet (let initializeProductsPage handle it)
    if (!category && !collection && !occasion && !fabric) {
        console.log('No URL parameters found');
        filteredFabrics = [...fabricData];
        console.log('filteredFabrics set to:', filteredFabrics.length);
        return false; // Return false to indicate no URL params, so caller can handle display
    }
    
    if (category) {
        console.log('Filtering by category:', category);
        // Check the appropriate checkbox
        if (category === 'lehengas') {
            const lehengaCheckbox = document.getElementById('cat-lehenga');
            if (lehengaCheckbox) {
                lehengaCheckbox.checked = true;
            }
            // Uncheck "All Fabrics"
            const allCheckbox = document.getElementById('cat-all');
            if (allCheckbox) {
                allCheckbox.checked = false;
            }
        } else if (category === 'sarees') {
            const sareesCheckbox = document.getElementById('cat-sarees');
            if (sareesCheckbox) {
                sareesCheckbox.checked = true;
            }
            // Uncheck "All Fabrics"
            const allCheckbox = document.getElementById('cat-all');
            if (allCheckbox) {
                allCheckbox.checked = false;
            }
        }
        
        // Filter by category - handle both 'lehenga' and 'lehengas'
        filteredFabrics = fabricData.filter(fabric => {
            // Handle both singular and plural forms
            if (category === 'lehengas' && fabric.category === 'lehenga') {
                return true;
            }
            return fabric.category === category;
        });
        console.log('Filtered fabrics count:', filteredFabrics.length);
        
        // If category has fewer products, add similar-priced products
        const MIN_PRODUCTS_THRESHOLD = 6; // Minimum products to show
        if (filteredFabrics.length > 0 && filteredFabrics.length < MIN_PRODUCTS_THRESHOLD) {
            console.log(`Only ${filteredFabrics.length} products found, adding similar-priced products...`);
            
            // Calculate average price of filtered products
            const avgPrice = filteredFabrics.reduce((sum, f) => sum + f.price, 0) / filteredFabrics.length;
            const priceTolerance = avgPrice * 0.30; // 30% price tolerance
            const minPrice = avgPrice - priceTolerance;
            const maxPrice = avgPrice + priceTolerance;
            
            console.log(`Average price: ${avgPrice}, Price range: ${minPrice} - ${maxPrice}`);
            
            // Get IDs of already filtered products to avoid duplicates
            const filteredIds = new Set(filteredFabrics.map(f => f.id));
            
            // Get current price range
            const priceRange = getPriceRange();
            
            // Find products with similar prices that aren't already in the filtered list
            const similarPricedProducts = fabricData.filter(fabric => {
                // Skip if already in filtered results
                if (filteredIds.has(fabric.id)) {
                    return false;
                }
                
                // Check if price is within tolerance range
                const priceMatch = fabric.price >= minPrice && fabric.price <= maxPrice;
                
                // Also check if price is within the current price range filter
                const priceInRange = fabric.price >= priceRange.min && fabric.price <= priceRange.max;
                
                return priceMatch && priceInRange;
            });
            
            // Sort by price difference (closest first)
            similarPricedProducts.sort((a, b) => {
                const diffA = Math.abs(a.price - avgPrice);
                const diffB = Math.abs(b.price - avgPrice);
                return diffA - diffB;
            });
            
            // Add similar products to fill up to threshold
            const neededCount = MIN_PRODUCTS_THRESHOLD - filteredFabrics.length;
            const productsToAdd = similarPricedProducts.slice(0, neededCount);
            
            console.log(`Adding ${productsToAdd.length} similar-priced products`);
            filteredFabrics = [...filteredFabrics, ...productsToAdd];
            
            // Sort by price to keep them organized
            filteredFabrics.sort((a, b) => a.price - b.price);
            
            console.log(`Total products after adding similar: ${filteredFabrics.length}`);
        }
        
        displayFabrics();
        // Hide Apply button since filters are applied from URL params
        hideApplyButton();
        return true; // Return true to indicate we handled URL params and displayed
    } else if (collection || occasion || fabric) {
        // For collection, occasion, or fabric parameters, show all products for now
        // (since products don't have these properties yet)
        filteredFabrics = [...fabricData];
        console.log('Showing all fabrics for collection/occasion/fabric param');
        displayFabrics();
        // Hide Apply button since filters are applied from URL params
        hideApplyButton();
        return true; // Return true to indicate we handled URL params and displayed
    }
    
    return false;
}

// Interactive Features
function initializeInteractiveFeatures() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize modals
    initializeModals();
    
    // Add event listeners for Order Now buttons
    setTimeout(function() {
        console.log('ðŸ”§ Setting up Order Now button listeners...');
        const orderButtons = document.querySelectorAll('.order-now-btn');
        console.log('ðŸ” Found', orderButtons.length, 'Order Now buttons');
        
        orderButtons.forEach(function(button, index) {
            console.log(`ðŸ”˜ Button ${index + 1}:`, button);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('ðŸ–±ï¸ Order Now button clicked via event listener!');
                const fabricId = this.getAttribute('data-fabric-id');
                console.log('ðŸ†” Fabric ID from data attribute:', fabricId);
                orderNow(fabricId);
            });
        });
    }, 1000);
}

// Initialize Modals
function initializeModals() {
    // Login modal
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register modal
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Inquiry modal
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiry);
    }
    
    // Subscribe form
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribe);
    }
}

// Modal Functions
function openLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function openRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function openInquiryModal() {
    const modal = new bootstrap.Modal(document.getElementById('inquiryModal'));
    modal.show();
}

// Notification Functions
function showNotification(type, title, message) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    const icon = toast.querySelector('.notification-icon');
    const titleEl = toast.querySelector('.notification-title');
    const messageEl = toast.querySelector('.notification-message');
    
    // Remove all type classes
    toast.classList.remove('success', 'error', 'warning', 'info');
    
    // Set icon based on type
    let iconClass = 'fas fa-info-circle';
    let iconColor = 'var(--primary-color)';
    
    switch(type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            iconColor = '#28a745';
            toast.classList.add('success');
            break;
        case 'error':
            iconClass = 'fas fa-times-circle';
            iconColor = 'var(--accent-color)';
            toast.classList.add('error');
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-circle';
            iconColor = 'var(--gold-accent)';
            toast.classList.add('warning');
            break;
        default:
            toast.classList.add('info');
    }
    
    if (icon) {
        icon.className = 'notification-icon ' + iconClass;
        icon.style.color = iconColor;
    }
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    
    // Show notification
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Form Handlers
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login validation (replace with actual API call)
    // For demo purposes, we'll show success/warning based on simple check
    if (email && password) {
        // Simulate API call delay
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showNotification('success', 'Welcome!', 'You have successfully logged in to your account.');
            
            // Update UI to show logged in state (optional)
            const loginBtn = document.querySelector('button[onclick="openLoginModal()"]');
            if (loginBtn) {
                loginBtn.textContent = 'Logout';
                loginBtn.setAttribute('onclick', 'handleLogout()');
            }
        }, 500);
    } else {
        showNotification('error', 'Login Failed', 'Wrong password or user ID. Please try again.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Basic validation
    if (password !== confirmPassword) {
        showNotification('error', 'Registration Failed', 'Passwords do not match. Please try again.');
        return;
    }
    
    if (name && email && password) {
        // Simulate API call delay
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            showNotification('success', 'Account Created Successfully', 'Welcome to BABISHA! Your account has been created successfully.');
        }, 500);
    } else {
        showNotification('error', 'Registration Failed', 'Please fill in all required fields.');
    }
}

function handleLogout() {
    showNotification('success', 'Logged Out Successfully', 'You have been logged out of your account.');
    
    // Update UI to show logged out state
    const loginBtn = document.querySelector('button[onclick="handleLogout()"]');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.setAttribute('onclick', 'openLoginModal()');
    }
}

function handleInquiry(e) {
    e.preventDefault();
    // Handle inquiry logic
    console.log('Inquiry form submitted');
    bootstrap.Modal.getInstance(document.getElementById('inquiryModal')).hide();
}

function handleSubscribe(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    
    if (email && phone) {
        // Simulate API call delay
        setTimeout(() => {
            showNotification('success', 'Subscribed Successfully!', 'Thank you for subscribing. You will receive updates about new products, discounts, and special offers.');
            form.reset();
        }, 500);
    } else {
        showNotification('error', 'Subscription Failed', 'Please fill in all required fields.');
    }
}

// WhatsApp Order Function
// Order Now Function - WhatsApp Integration
function orderNow(fabricId) {
    console.log('ðŸŽ¯ Order Now clicked for fabric ID:', fabricId);
    console.log('ðŸ" Current fabricData:', fabricData);
    
    const fabric = fabricData.find(f => f.id === fabricId);
    if (fabric) {
        console.log('₹œ… Found fabric:', fabric.name);
        console.log('ðŸ"± Creating WhatsApp message...');
        const message = `Hi! I'm interested in ordering this product:

*${fabric.name}*
Price: ₹${fabric.price.toLocaleString()}/piece
${fabric.onSale ? `Original Price: ₹${fabric.originalPrice.toLocaleString()} (Save ${fabric.savings}%)` : ''}

Supplier: ${fabric.supplier}

Please let me know about availability and ordering process. Thank you!`;

        const whatsappUrl = `https://wa.me/919624113555?text=${encodeURIComponent(message)}`;
        console.log('ðŸ"— WhatsApp URL created:', whatsappUrl);
        window.open(whatsappUrl, '_blank');
        console.log('₹œ… WhatsApp opened successfully!');
    } else {
        console.error('₹Œ Fabric not found for ID:', fabricId);
        console.log('ðŸ" Available fabric IDs:', fabricData.map(f => f.id));
        alert('Sorry, there was an error finding this product. Please try again.');
    }
}

// Cart Functions (kept for compatibility)
function addToCart(fabricId) {
    // Redirect to WhatsApp instead
    orderNow(fabricId);
}

function openCart() {
    console.log('Opening cart');
    // Cart logic here
}

function openWishlist() {
    console.log('Opening wishlist');
    // Wishlist logic here
}

// Fabric Details
function viewFabricDetails(fabricId) {
    // Navigate to product detail page with fabric ID
    window.location.href = `product-detail.html?id=${fabricId}`;
}

// Store current product ID for order now button
let currentProductId = null;

// Load product details on product detail page
function loadProductDetails() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        console.error('No product ID found in URL');
        return;
    }
    
    // Store product ID globally for order now button
    currentProductId = productId;
    
    // Find product in fabricData or sampleFabrics
    const allFabrics = fabricData && fabricData.length > 0 ? fabricData : (sampleFabrics || []);
    const fabric = allFabrics.find(f => f.id === productId);
    
    if (!fabric) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Populate product details
    const productImage = document.getElementById('productImage');
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productStars = document.getElementById('productStars');
    const productRating = document.getElementById('productRating');
    const productDescription = document.getElementById('productDescription');
    const specifications = document.getElementById('specifications');
    const supplierInfo = document.getElementById('supplierInfo');
    
    if (productImage) productImage.src = fabric.image;
    if (productImage) productImage.alt = fabric.name;
    
    if (productTitle) productTitle.textContent = fabric.name;
    
    if (productPrice) {
        let priceHtml = `₹${fabric.price.toLocaleString()}/piece`;
        if (fabric.onSale) {
            priceHtml += ` <span class="text-muted text-decoration-line-through ms-2">₹${fabric.originalPrice.toLocaleString()}</span>`;
            priceHtml += ` <span class="badge bg-danger ms-2">Save ${fabric.savings}%</span>`;
        }
        productPrice.innerHTML = priceHtml;
    }
    
    if (productStars) productStars.innerHTML = generateStars(fabric.rating);
    if (productRating) productRating.textContent = `${fabric.rating} (${fabric.reviews} reviews)`;
    
    if (productDescription) productDescription.textContent = fabric.description;
    
    if (specifications) {
        specifications.innerHTML = `
            <div class="spec-row">
                <span class="spec-label">GSM:</span>
                <span class="spec-value">${fabric.specifications.gsm}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Material:</span>
                <span class="spec-value">${fabric.specifications.material}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Width:</span>
                <span class="spec-value">${fabric.specifications.width}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Colors:</span>
                <span class="spec-value">${fabric.specifications.colors}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Origin:</span>
                <span class="spec-value">${fabric.specifications.origin}</span>
            </div>
        `;
    }
    
    if (supplierInfo) {
        supplierInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><i class="fas fa-store me-2"></i>Supplier Information</h5>
                    <p class="card-text"><strong>Supplier:</strong> ${fabric.supplier}</p>
                    <p class="card-text"><strong>Category:</strong> <span class="text-capitalize">${fabric.category}</span></p>
                    ${fabric.onSale ? `<p class="card-text"><strong>Status:</strong> <span class="badge bg-success">On Sale - Save ${fabric.savings}%</span></p>` : ''}
                </div>
            </div>
        `;
    }
    
    // Load related products
    loadRelatedProducts(productId);
}

// Extract folder name from image path
function getFolderName(imagePath) {
    if (!imagePath) return null;
    // Extract folder name from path like "002. TAARANI-A/TAARANI-A1.jpeg"
    const parts = imagePath.split('/');
    if (parts.length > 0) {
        return parts[0].trim(); // Returns "002. TAARANI-A"
    }
    return null;
}

// Extract base collection name (e.g., "TAARANI-A" from "002. TAARANI-A")
function getCollectionName(folderName) {
    if (!folderName) return null;
    // Remove leading numbers and dots, get the collection name
    const match = folderName.match(/\d+\.\s*(.+)/);
    if (match && match[1]) {
        return match[1].trim(); // Returns "TAARANI-A"
    }
    return folderName;
}

// Load related products (match by folder name first, then fill with category-based)
function loadRelatedProducts(currentProductId) {
    const allFabrics = fabricData && fabricData.length > 0 ? fabricData : (sampleFabrics || []);
    const currentProduct = allFabrics.find(f => f.id === currentProductId);
    
    if (!currentProduct) return;
    
    // Get current product's folder name
    const currentFolderName = getFolderName(currentProduct.image);
    const currentCollectionName = currentFolderName ? getCollectionName(currentFolderName) : null;
    
    let related = [];
    const maxProducts = 3;
    
    // First, try to find products with similar folder/collection name
    if (currentCollectionName) {
        related = allFabrics.filter(f => {
            if (f.id === currentProductId) return false; // Exclude current product
            
            const folderName = getFolderName(f.image);
            const collectionName = folderName ? getCollectionName(folderName) : null;
            
            // Match if collection name is similar (case-insensitive)
            if (collectionName && collectionName.toLowerCase() === currentCollectionName.toLowerCase()) {
                return true;
            }
            
            // Also check if folder names are similar (for partial matches)
            if (folderName && currentFolderName) {
                const folderBase = folderName.toLowerCase().replace(/^\d+\.\s*/, '');
                const currentFolderBase = currentFolderName.toLowerCase().replace(/^\d+\.\s*/, '');
                if (folderBase === currentFolderBase) {
                    return true;
                }
            }
            
            return false;
        });
    }
    
    // Limit folder-matched products
    related = related.slice(0, maxProducts);
    
    // If we have less than 3 products from folder match, fill remaining slots with category-based products
    if (related.length < maxProducts) {
        const remainingSlots = maxProducts - related.length;
        const relatedIds = new Set(related.map(f => f.id)); // Track already added product IDs
        relatedIds.add(currentProductId); // Also exclude current product
        
        // Get category-based products, excluding already added ones
        const categoryProducts = allFabrics
            .filter(f => {
                return f.category === currentProduct.category && 
                       f.id !== currentProductId && 
                       !relatedIds.has(f.id);
            })
            .slice(0, remainingSlots);
        
        // Add category-based products to fill remaining slots
        related = [...related, ...categoryProducts];
    }
    
    // If still no products found, show any products from same category
    if (related.length === 0) {
        related = allFabrics
            .filter(f => f.category === currentProduct.category && f.id !== currentProductId)
            .slice(0, maxProducts);
    }
    
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;
    
    if (related.length === 0) {
        relatedContainer.innerHTML = '<div class="col-12 text-center text-muted">No related products found.</div>';
        return;
    }
    
    relatedContainer.innerHTML = '';
    related.forEach(fabric => {
        const card = createFabricCard(fabric);
        relatedContainer.appendChild(card);
    });
}

// Filter Functions
function toggleFilterSection(element) {
    const options = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (!options) return;
    
    // Toggle show class (CSS handles the animation)
    if (options.classList.contains('show')) {
        options.classList.remove('show');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    } else {
        options.classList.add('show');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
}

function clearAllFilters() {
    // Reset all filter inputs - check "All Fabrics", uncheck others
    const allCheckbox = document.getElementById('cat-all');
    const filterInputs = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    filterInputs.forEach(input => {
        if (input.id === 'cat-all') {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    
    // Reset price range to actual product price range
    if (fabricData && fabricData.length > 0) {
        const prices = fabricData.map(f => f.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        const priceRangeSlider = document.getElementById('priceRange');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        
        if (priceRangeSlider) {
            priceRangeSlider.value = maxPrice;
        }
        if (minPriceInput) {
            minPriceInput.value = Math.floor(minPrice * 0.8);
        }
        if (maxPriceInput) {
            maxPriceInput.value = maxPrice;
        }
    } else {
        // Fallback values
        const priceRange = document.getElementById('priceRange');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        
        if (priceRange) {
            priceRange.value = 15000;
        }
        if (minPrice) {
            minPrice.value = 0;
        }
        if (maxPrice) {
            maxPrice.value = 15000;
        }
    }
    
    // Reset search
    const searchInput = document.getElementById('fabricSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'featured';
    }
    
    // Reset filters
    filteredFabrics = [...fabricData];
    currentPageNumber = 1;
    updateResultsCount();
    displayFabrics();
    
    // Hide Apply button since filters are reset
    hideApplyButton();
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fallback initialization with timeout - More aggressive
setTimeout(function() {
    console.log('=== FALLBACK INITIALIZATION CHECK ===');
    const fabricGrid = document.getElementById('fabricGrid');
    console.log('fabricGrid element:', fabricGrid);
    console.log('fabricGrid innerHTML length:', fabricGrid ? fabricGrid.innerHTML.length : 'N/A');
    console.log('fabricData length:', fabricData ? fabricData.length : 'undefined');
    console.log('filteredFabrics length:', filteredFabrics ? filteredFabrics.length : 'undefined');
    
    if (fabricGrid) {
        const isEmpty = !fabricGrid.innerHTML || fabricGrid.innerHTML.trim() === '' || 
                       fabricGrid.innerHTML.includes('Loading fabrics') ||
                       fabricGrid.innerHTML.includes('Fabric cards will be dynamically generated');
        
        if (isEmpty) {
            console.log('Fabric grid is empty, forcing display...');
            // Ensure data is loaded
            if (!fabricData || fabricData.length === 0) {
                if (sampleFabrics && sampleFabrics.length > 0) {
                    fabricData = [...sampleFabrics];
                    filteredFabrics = [...fabricData];
                    console.log('Data initialized from sampleFabrics:', fabricData.length);
                }
            }
            
            // Check if we're on products page
            const currentPage = getCurrentPage();
            if (currentPage === 'products') {
                console.log('On products page, calling displayFabrics...');
                displayFabrics();
            } else {
                console.log('Not on products page, current page:', currentPage);
            }
        } else {
            console.log('Fabric grid already has content');
        }
    } else {
        console.error('fabricGrid element not found in fallback!');
    }
}, 1000);

// Additional fallback after 3 seconds
setTimeout(function() {
    const fabricGrid = document.getElementById('fabricGrid');
    if (fabricGrid && (!fabricGrid.innerHTML || fabricGrid.innerHTML.trim() === '')) {
        console.log('=== SECOND FALLBACK - FORCING DISPLAY ===');
        if (sampleFabrics && sampleFabrics.length > 0) {
            fabricData = [...sampleFabrics];
            filteredFabrics = [...fabricData];
        }
        const currentPage = getCurrentPage();
        if (currentPage === 'products') {
            displayFabrics();
        }
    }
}, 3000);

// Test function to verify buttons are working
function testOrderNow() {
    console.log('ðŸ§ª Testing Order Now function...');
    if (fabricData.length > 0) {
        console.log('ðŸ” Testing with first fabric:', fabricData[0]);
        orderNow(fabricData[0].id);
    } else {
        console.log('₹Œ No fabric data available for testing');
    }
}

// Simple test function
function testClick() {
    console.log('ðŸ–±ï¸ Test click function called!');
    alert('Test click is working!');
}

// Direct WhatsApp order function
function orderNowDirect(fabricId) {
    console.log('ðŸŽ¯ Order Now Direct clicked for fabric ID:', fabricId);
    console.log('ðŸ” Current fabricData:', fabricData);
    console.log('ðŸ” fabricData length:', fabricData ? fabricData.length : 'undefined');
    
    const fabric = fabricData.find(f => f.id === fabricId);
    console.log('ðŸ” Found fabric:', fabric);
    
    if (fabric) {
        console.log('₹œ… Found fabric:', fabric.name);
        const message = `Hi! I am interested in ordering ${fabric.name} - Price: ₹${fabric.price.toLocaleString()}/piece. Please tell me more about availability and ordering process.`;
        console.log('ðŸ“ Message:', message);
        
        const whatsappUrl = `https://wa.me/919624113555?text=${encodeURIComponent(message)}`;
        console.log('ðŸ”— Opening WhatsApp:', whatsappUrl);
        
        try {
            window.open(whatsappUrl, '_blank');
            console.log('₹œ… WhatsApp window opened successfully!');
        } catch (error) {
            console.error('₹Œ Error opening WhatsApp:', error);
            alert('Error opening WhatsApp. Please try again.');
        }
    } else {
        console.error('₹Œ Fabric not found for ID:', fabricId);
        console.log('ðŸ” Available fabric IDs:', fabricData ? fabricData.map(f => f.id) : 'No fabric data');
        alert('Sorry, there was an error finding this product. Please try again.');
    }
}

// Test WhatsApp function
function testWhatsApp() {
    console.log('ðŸ“± Testing WhatsApp directly...');
    window.open('https://wa.me/919624113555?text=Hi! This is a test message from BABISHA website.', '_blank');
}

// Export functions for global access
window.addToCart = addToCart;
window.orderNow = orderNow;
window.orderNowDirect = orderNowDirect;

// Order Now function for product detail page
function orderNowFromDetailPage() {
    if (currentProductId) {
        orderNow(currentProductId);
    } else {
        // Fallback: try to get ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        if (productId) {
            orderNow(productId);
        } else {
            alert('Product information not available. Please refresh the page.');
        }
    }
}

window.orderNowFromDetailPage = orderNowFromDetailPage;
window.testOrderNow = testOrderNow;
window.testClick = testClick;
window.testWhatsApp = testWhatsApp;
window.openCart = openCart;
window.openWishlist = openWishlist;
window.viewFabricDetails = viewFabricDetails;
window.loadProductDetails = loadProductDetails;
window.loadRelatedProducts = loadRelatedProducts;
window.toggleFilterSection = toggleFilterSection;
window.clearAllFilters = clearAllFilters;
window.applyFiltersFromButton = applyFiltersFromButton;
window.showApplyButton = showApplyButton;
window.hideApplyButton = hideApplyButton;
window.initializeMobileFilterSidebar = initializeMobileFilterSidebar;

// Test function to verify button exists
window.testApplyButton = function() {
    const btn = document.getElementById('applyFiltersBtn');
    if (btn) {
        console.log('Button found!', btn);
        console.log('Current display:', window.getComputedStyle(btn).display);
        btn.style.display = 'block';
        btn.style.setProperty('display', 'block', 'important');
        alert('Button should be visible now. Check the filter sidebar.');
    } else {
        alert('Button NOT found in DOM!');
        console.error('Button not found');
    }
};
window.openLoginModal = openLoginModal;
window.goToPage = goToPage;
window.updateShowingRange = updateShowingRange;
window.createFabricCard = createFabricCard;

window.openRegisterModal = openRegisterModal;
window.openInquiryModal = openInquiryModal;
window.closeNotification = closeNotification;
window.showNotification = showNotification;
window.handleLogout = handleLogout;

// Hero Carousel Functionality
let currentHeroSlide = 0;
let heroSlideInterval = null;

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0) return;
    
    // First, hide all slides explicitly
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
        slide.style.pointerEvents = 'none';
        slide.style.zIndex = '0';
    });
    
    // Reset current slide
    currentHeroSlide = 0;
    
    // Set initial slide
    showSlide(0);
    
    // Auto-play is disabled - slides only change on manual navigation
}

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.hero-indicator');
    
    if (slides.length === 0) return;
    
    // Ensure index is within bounds
    if (index >= slides.length) {
        currentHeroSlide = 0;
    } else if (index < 0) {
        currentHeroSlide = slides.length - 1;
    } else {
        currentHeroSlide = index;
    }
    
    // Update slides - ensure only one is visible
    slides.forEach((slide, i) => {
        if (i === currentHeroSlide) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.pointerEvents = 'auto';
            slide.style.zIndex = '1';
        } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.pointerEvents = 'none';
            slide.style.zIndex = '0';
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === currentHeroSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    currentHeroSlide += direction;
    
    if (currentHeroSlide >= slides.length) {
        currentHeroSlide = 0;
    } else if (currentHeroSlide < 0) {
        currentHeroSlide = slides.length - 1;
    }
    
    showSlide(currentHeroSlide);
}

function currentSlide(index) {
    showSlide(index - 1); // Convert to 0-based index
}

// Make functions globally available
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Initialize carousel when DOM is ready
function initializeCarousel() {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        initHeroCarousel();
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else {
    initializeCarousel();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (document.querySelectorAll('.hero-slide.active').length === 0) {
        initHeroCarousel();
    }
});

