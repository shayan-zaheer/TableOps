const express = require('express');
const router = express.Router();
const {
    getAuditLogs,
    addAuditLog
} = require('../controllers/auditController');

router.get("/", getAuditLogs);
router.post("/", addAuditLog);

module.exports = router;
