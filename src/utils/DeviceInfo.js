const UserAgent = require("user-agent")

function extractDeviceInfo(headers) {
    const userAgentString = headers['user-agent'];
    return userAgentString ? UserAgent.parse(userAgentString) : "Unknown device";
}

function mapDeviceInfo(deviceDetails) {
    return {
        userAgent: deviceDetails?.full || "",
        browser: deviceDetails?.name || "",
        version: deviceDetails?.version || "",
        platform: deviceDetails?.os || "",
        device: deviceDetails?.fullName || "",
    };
}

module.exports = { extractDeviceInfo, mapDeviceInfo };
