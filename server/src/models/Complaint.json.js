const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'complaints.json');

// Ensure data file exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

class Complaint {
    constructor(data) {
        this._id = data._id || 'CMP-' + Math.floor(100 + Math.random() * 900);
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.priority = data.priority || 'Medium';
        this.status = data.status || 'Open';
        this.user = data.user; // User Object or ID
        this.userId = data.userId;
        this.userName = data.userName;
        this.attachments = data.attachments || [];
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    static async create(data) {
        const complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const newComplaint = new Complaint(data);
        complaints.push(newComplaint);
        fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2));
        return newComplaint;
    }

    static async find(query = {}) {
        const complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        let filtered = complaints.map(c => new Complaint(c));

        if (query.userId) {
            filtered = filtered.filter(c => c.userId === query.userId);
        }

        // Simple sorting by date desc
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    static async findById(id) {
        const complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const complaint = complaints.find(c => c._id === id);
        return complaint ? new Complaint(complaint) : null;
    }

    static async findByIdAndUpdate(id, update) {
        const complaints = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const index = complaints.findIndex(c => c._id === id);

        if (index === -1) return null;

        const updatedComplaint = { ...complaints[index], ...update };
        complaints[index] = updatedComplaint;

        fs.writeFileSync(DATA_FILE, JSON.stringify(complaints, null, 2));
        return new Complaint(updatedComplaint);
    }
}

module.exports = Complaint;
