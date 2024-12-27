const Report = require('../models/Report');

class ReportService {
    async createReport(reportData, unique_link) {
        try {
            const allowedCategories = ['Safety', 'Incident', 'Maintenance', 'Hazard', 'Crime', 'Complaint'];

            if (!allowedCategories.includes(reportData.category)) {
                return { status: 400, message: 'Invalid category. Allowed categories: ' + allowedCategories.join(', ') };
            }

            const filteredData = {};
            for (let key in reportData) {
                if (allowedCategories.includes(key)) {
                    if (reportData[key] === "" || reportData[key] === null) {
                        delete reportData[key]; // Remove empty or null values
                    }
                    filteredData[key] = reportData[key];
                }
            }

            const existingReport = await Report.findOne({
                unique_link,
                description: reportData.description,
                category: reportData.category,
                evidence: reportData.evidence,
            })

            if (existingReport) {
                return { status: 409, message: 'Duplicate, report already exists!' };
            }

            // Create the report with the associated user
            const newReport = await Report.create({ ...reportData, unique_link }, undefined);

            return { status: 201, data: newReport }; // Return status code 201 (Created)
        } catch (error) {
                console.error("Internal Server Error:", error); // Log the error for debugging
                return { status: 500, message: 'Internal Server Error' };
        }
    }

    async getReportsByUser(unique_link) {
        try {
            const reports = await Report.find({unique_link} );
            console.log("Reports found: ", reports);

            if (!reports || reports.length === 0) {
                return { status: 404, message: 'No reports found for this user' };
            }

            return { status: 200, data: reports }; // Return 200 OK
        } catch (error) {
            if (error.message === 'CastError') {
                return { status: 400, message: 'Invalid unique link.' };
            } else {
                return {status: 500, message: 'Internal Server Error: ' + error.message};
            }
        }
    }
}

module.exports = new ReportService();