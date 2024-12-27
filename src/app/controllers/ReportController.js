const ReportService = require('../services/ReportService');

class ReportController {
    async createReport(req, res) {
        try {
            const reportData = req.body;
            const { unique_link } = req.params;

            const { status, message, data } = await ReportService.createReport(reportData, unique_link);

            // Send the correct status and message from the service
            res.status(status).json({ message, data });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    async getReport(req, res) {
        try {
            const { unique_link } = req.params;

            const { status, data, message } = await ReportService.getReportsByUser(unique_link);
            res.status(status).json({message, data});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving reports' });
        }
    }
}

module.exports = new ReportController();