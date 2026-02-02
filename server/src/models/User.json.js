const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'users.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

class User {
    constructor(data) {
        this._id = data._id || Date.now().toString();
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'user';
        this.organizationId = data.organizationId;
        this.organizationName = data.organizationName;
        this.resetPasswordToken = data.resetPasswordToken;
        this.resetPasswordExpire = data.resetPasswordExpire ? new Date(data.resetPasswordExpire) : undefined;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    static async findOne(query) {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const user = users.find(u => {
            for (let key in query) {
                if (key === 'resetPasswordExpire') {
                    // Handle date comparison manually if needed, but for simple match:
                    continue; // Skip complex date query in simple logic, handle in logic
                }
                if (u[key] !== query[key]) return false;
            }
            return true;
        });

        // Special handling for token expiry check which is usually a query operator
        if (user && query.resetPasswordExpire) {
            // This is a simplification. The controller does { resetPasswordExpire: { $gt: Date.now() } }
            // We will handle this logic in the controller or enhance this mock. 
            // For now, return user and let controller check logic or modify findOne to support $gt
        }

        return user ? new User(user) : null;
    }

    static async create(data) {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        if (users.find(u => u.email === data.email)) {
            const err = new Error('Duplicate key');
            err.code = 11000;
            throw err;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = new User({ ...data, password: hashedPassword });
        users.push(newUser);
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        return newUser;
    }

    // Mock select method for chaining (e.g. .select('+password'))
    static select(field) {
        return this; // No-op in JSON
    }

    select(field) {
        return this;
    }

    async save() {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const index = users.findIndex(u => u._id === this._id);

        // If password was modified (plain text), hash it. 
        // Heuristic: if it doesn't start with $2b$, it might be plain text.
        if (this.password && !this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }

        if (index !== -1) {
            users[index] = this;
        } else {
            users.push(this);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        return this;
    }

    async matchPassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    getSignedJwtToken() {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        });
    }
}

// Enhance findOne to handle the specific OTP expiration query pattern
const originalFindOne = User.findOne;
User.findOne = async function (query) {
    const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    return users.map(u => new User(u)).find(u => {
        // Email check
        if (query.email && u.email !== query.email) return false;

        // Token check
        if (query.resetPasswordToken && u.resetPasswordToken !== query.resetPasswordToken) return false;

        // Expiry check ($gt)
        if (query.resetPasswordExpire && query.resetPasswordExpire.$gt) {
            const expiry = new Date(u.resetPasswordExpire).getTime();
            if (expiry <= query.resetPasswordExpire.$gt) return false;
        }

        return true;
    }) || null;
};


module.exports = User;
