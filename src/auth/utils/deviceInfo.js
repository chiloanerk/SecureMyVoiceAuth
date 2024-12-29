const UserAgent = require("user-agent")

const extractDeviceInfo = (headers) => {
    const userAgentString = headers['user-agent'];
    return userAgentString ? UserAgent.parse(userAgentString) : "Unknown device";
};

module.exports = { extractDeviceInfo };
