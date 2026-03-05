const express = require('express');
const router = express.Router();
const {
    getOrgUsers,
    searchUserByEmail,
    addUserToOrg,
    removeUserFromOrg,
    getOrgStats
} = require('../controllers/organization.controller');

router.get('/users', getOrgUsers);
router.get('/search', searchUserByEmail);
router.get('/stats', getOrgStats);
router.post('/users', addUserToOrg);
router.delete('/users/:id', removeUserFromOrg);

module.exports = router;
