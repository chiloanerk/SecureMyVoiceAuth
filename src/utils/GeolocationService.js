const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const getGeoLocation = async (ipAddress) => {
    try {
        // Using ipapi.co for geolocation
        const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);

        if (!response.ok) {
            console.warn(`Geolocation API returned non-OK status: ${response.status} - ${response.statusText}`);
            const errorText = await response.text();
            console.warn(`Geolocation API error response: ${errorText.substring(0, 200)}...`); // Log first 200 chars
            return null;
        }

        const data = await response.json();

        // ipapi.co returns an error field if something went wrong, even with 200 OK
        if (data.error) {
            console.warn(`Geolocation failed for IP ${ipAddress}: ${data.reason}`);
            return null;
        }

        return {
            city: data.city || null,
            region: data.region || null,
            country: data.country_name || null,
        };
    } catch (error) {
        console.error(`Error fetching geolocation for IP ${ipAddress}:`, error);
        return null;
    }
};

module.exports = { getGeoLocation };
