const ReportService = require('../Services/ReportService');

class ReportController {
    async createReport(req, res) {
        try {
            const reportData = req.body;
            const { unique_link } = req.params;

            // Validate report data (e.g., required fields, data types)

            const newReport = await ReportService.createReport(reportData, unique_link);
            res.status(201).json(newReport);
        } catch (error) {
            console.error(error);
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: 'Validation error: ' + error.message });
            } else if (error.name === 'CastError') {
                throw new Error('Invalid data type encountered.');
            }
            else {
                throw new Error('Error creating report' + error.message);
            }
        }
    }

    async getReport(req, res) {
        try {
            const { unique_link } = req.params;

            // Implement authorization check here (e.g., using JWTs)

            const { status, data, message } = await ReportService.getReportsByUser(unique_link);
            res.status(status).json({message, data});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving reports' });
        }
    }
}

module.exports = new ReportController();