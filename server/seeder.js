const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./src/models/User.model');
const Role = require('./src/models/Role.model');
const IssueCategory = require('./src/models/IssueCategory.model');
const WorkerCategory = require('./src/models/WorkerCategory.model');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            family: 4
        });
        console.log('Connected to MongoDB...');

        // 1. Create Default Roles
        const roles = [
            { name: 'user', description: 'Regular Citizen/User' },
            { name: 'worker', description: 'Field Worker/Technician' },
            { name: 'organization', description: 'Organization Manager' },
            { name: 'admin', description: 'System Super Admin' }
        ];

        for (const role of roles) {
            await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true, new: true });
        }
        console.log(' Default roles created');

        // 2. Create Super Admin
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin@123';

        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            admin = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log(' Super Admin created: admin@gmail.com / admin@123');
        } else {
            admin.role = 'admin'; // Ensure role is correct
            admin.password = adminPassword; // Reset to default for user convenience
            await admin.save();
            console.log(' Super Admin credentials reset to: admin@gmail.com / admin@123');
        }

        // 3. Create Default Categories
        const issueCategories = ['Electricity', 'Water Leakage', 'Road Repair', 'Sanitation'];
        const workerCategories = ['Electrician', 'Plumber', 'Cleaner'];

        for (const name of issueCategories) {
            await IssueCategory.findOneAndUpdate({ name }, { name }, { upsert: true });
        }
        for (const name of workerCategories) {
            await WorkerCategory.findOneAndUpdate({ name }, { name }, { upsert: true });
        }
        console.log(' Default categories created in separate collections');

        console.log('\n--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error(' Seeding Error:', err.message);
        process.exit(1);
    }
};

seedData();
