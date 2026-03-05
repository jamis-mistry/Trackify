const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'categories.json');

// Ensure data file exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

class Category {
    constructor(data) {
        this.id = data.id || 'cat-' + Math.floor(1000 + Math.random() * 9000);
        this.type = data.type; // 'worker' or 'issue'
        this.name = data.name;
    }

    static async find(query = {}) {
        try {
            const categories = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            let filtered = categories.map(c => new Category(c));

            if (query.type) {
                filtered = filtered.filter(c => c.type === query.type);
            }

            return filtered;
        } catch (error) {
            console.error("Error finding categories", error);
            return [];
        }
    }

    static async create(data) {
        const categories = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const newCategory = new Category(data);
        categories.push(newCategory);
        fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2));
        return newCategory;
    }

    static async findByIdAndDelete(id) {
        const categories = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const filtered = categories.filter(c => c.id !== id);
        if (categories.length === filtered.length) return null;
        fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
        return true;
    }
}

module.exports = Category;
