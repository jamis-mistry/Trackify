const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'users.json');

async function updateAdmin() {
    try {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

        // Find existing Super Admin or naivedh user to replace, or create new
        // The user specifically asked to change "superadmin@trackify.com" to "admin@gmail.com"

        const superIndex = users.findIndex(u => u.email === "superadmin@trackify.com");
        let targetUser = superIndex >= 0 ? users[superIndex] : null;

        // If not found, maybe create new
        if (!targetUser) {
            console.log("Super admin not found, creating new entry...");
            targetUser = {
                _id: "admin-" + Date.now(),
                role: "admin",
                createdAt: new Date()
            };
            users.push(targetUser);
        }

        // Update fields
        targetUser.name = "Super Admin";
        targetUser.email = "admin@gmail.com";

        // Hash 'admin@123'
        const salt = await bcrypt.genSalt(10);
        targetUser.password = await bcrypt.hash('admin@123', salt);

        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        console.log("Admin credentials updated successfully!");
    } catch (e) {
        console.error("Error updating admin:", e);
    }
}

updateAdmin();
