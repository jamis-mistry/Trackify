const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'roles.json');

// Ensure data file exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    // Seed with basic roles
    const initialRoles = [
        { id: 'role-1', name: 'user', description: 'Regular User' },
        { id: 'role-2', name: 'worker', description: 'Service Provider' },
        { id: 'role-3', name: 'organization', description: 'Org Manager' },
        { id: 'role-4', name: 'admin', description: 'System Admin' }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialRoles, null, 2));
}

class Role {
    constructor(data) {
        this.id = data.id || 'role-' + Math.floor(1000 + Math.random() * 9000);
        this.name = data.name;
        this.description = data.description || '';
    }

    static async find() {
        try {
            const roles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            return roles.map(r => new Role(r));
        } catch (error) {
            console.error("Error finding roles", error);
            return [];
        }
    }

    static async create(data) {
        const roles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const newRole = new Role(data);
        roles.push(newRole);
        fs.writeFileSync(DATA_FILE, JSON.stringify(roles, null, 2));
        return newRole;
    }

    static async findByIdAndDelete(id) {
        const roles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const filtered = roles.filter(r => r.id !== id);
        if (roles.length === filtered.length) return null;
        fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
        return true;
    }
}

module.exports = Role;
