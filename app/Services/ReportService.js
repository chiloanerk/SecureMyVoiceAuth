const Report = require('../Models/Report');
const User = require('../Models/User');

class ReportService {
    async createReport(reportData, uniqueLink) {
        try {
            console.log("Received uniqueLink:", uniqueLink);
            // Find the user associated with the unique link
            const user = await User.findOne({ unique_link: uniqueLink });
            if (!user) {
                throw new Error('User not found for the provided unique link.');
            }

            // Create the report with the associated user
            const newReport = await Report.create({ ...reportData, user: user._id });

            return { status: 201, data: newReport }; // Return status code 201 (Created)
        } catch (error) {
            if (error.message === 'User not found for the provided unique link.') {
                return { status: 404, message: error.message }; // Return 404 Not Found
            } else {
                return { status: 500, message: 'Internal Server Error' };
            }
        }
    }

    async getReportsByUser(uniqueLink) {
        try {
            // Find the report associated with the unique link
            const reports = await Report.find({
                'user.unique_link': uniqueLink
            }).populate('user', '-password');

            if (!report || reports.length === 0) {
                return { status: 404, message: 'No reports found for this user.' }; // Return 404 Not Found
            }

            return { status: 200, data: reports }; // Return 200 OK
        } catch (error) {
            if (error.message === 'Cast error') {
                return { status: 400, message: 'Invalid unique link.' };
            } else {
                return {status: 500, message: 'Internal Server Error: ' + error.message};
            }
        }
    }
}

module.exports = new ReportService();