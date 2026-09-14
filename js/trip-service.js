const API_BASE_URL = 'https://aitravel.runasp.net/api/Trips';
const BOOKINGS_URL = 'https://aitravel.runasp.net/api/Bookings';
const RATINGS_URL =  'https://aitravel.runasp.net/api/Rating'
// Trip
async function createTrip(tripData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
    });

    if (!response.ok) {
        throw new Error(`Failed to create trip: ${response.status}`);
    }

    return await response.json();
}

async function generateItinerary(itineraryData) {
    const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itineraryData)
    });

    if (!response.ok) {
        throw new Error(`Failed to generate itinerary: ${response.status}`);
    }

    return await response.json();
}

// Booking
async function createBooking(bookingData) {
    const response = await fetch(BOOKINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        throw new Error(`Failed to create booking: ${response.status}`);
    }

    return await response.json();
}

// Init Payment
async function initiatePayment(bookingId) {
    const response = await fetch(`${BOOKINGS_URL}/${bookingId}/initiate-payment`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`Failed to initiate payment: ${response.status}`);
    }
    const text =  await response.text();
    return text.replace(/^"|"$/g,'');
}


// Rating (  create rate )
async function CreateRaing(ratingData) {
    const response = await fetch(RATINGS_URL,{
        method: 'POST',
        headers:{'Content-type' : 'application/json'},
        body:JSON.stringify(ratingData)
    });
    if(!response.ok)
    {
        const errorText = await response.text();
        throw new Error (errorText ||`Failed to create rating ${response.status}`);
    }
    const text = await response.text();
    return text.replace(/^"|"$/g,'')
    
}
