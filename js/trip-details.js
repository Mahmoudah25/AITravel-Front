const urlParams = new URLSearchParams(window.location.search);
initializeNotifications('test@example.com');
const currentTrip = {
    tripId: urlParams.get('tripId'),
    destination: urlParams.get('destination'),
    days: parseInt(urlParams.get('days')),
    budget: parseFloat(urlParams.get('budget'))
};

document.getElementById('tripTitle').textContent = `${currentTrip.destination} Trip`;

document.getElementById('generateBtn').addEventListener('click', async function () {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn.disabled) return
    const itineraryResultDiv = document.getElementById('itineraryResult');

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    itineraryResultDiv.innerHTML = '';

    try {
        const itinerary = await generateItinerary(currentTrip);
        SaveActivityForRating(itinerary);
        renderItinerary(itinerary);
    } catch (error) {
        itineraryResultDiv.innerHTML = '<p class="error">Failed to generate itinerary.</p>';
        console.error(error);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Itinerary';
    }
});

function renderItinerary(itinerary) {
    const container = document.getElementById('itineraryResult');
    container.innerHTML = '';

    itinerary.days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-card';

        const dayTitle = document.createElement('h3');
        const weatherInfo = day.weatherCondition
            ? ` (${getWeatherIcon(day.weatherCondition)} ${Math.round(day.temperatureCelsius)}°C)`
            : '';
        dayTitle.textContent = `Day ${day.dayNumber}${weatherInfo}`;
        dayDiv.appendChild(dayTitle);

        const activityList = document.createElement('div');
        activityList.className = 'activity-list';

        day.activities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'activity-item';

            const icon = getActivityIcon(activity.type);
            const isBookable = activity.estimatedCost > 0;
            const mapQuery = encodeURIComponent(`${activity.placeName}, ${currentTrip.destination}`);
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

            activityDiv.innerHTML = `
                <div class="activity-time">${activity.time}</div>
                <div class="activity-details">
                    <span class="activity-icon">${icon}</span>
                    <span class="activity-name">${activity.placeName}</span>
                    <span class="activity-type">${activity.type}</span>
                    <a href="${mapUrl}" target="_blank" class="map-link">View on Map</a>
                </div>
                <div class="activity-cost">$${activity.estimatedCost}</div>
                ${isBookable
                    ? `<button class="book-btn" data-activity-id="${activity.activityId}" data-cost="${activity.estimatedCost}">Book & Pay</button>`
                    : `<span class="free-label">Free</span>`
                }
            `;

            activityList.appendChild(activityDiv);
        });

        dayDiv.appendChild(activityList);
        container.appendChild(dayDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-cost-card';
    totalDiv.innerHTML = `<span>Total Estimated Cost</span><strong>$${itinerary.totalEstimatedCost}</strong>`;
    container.appendChild(totalDiv);

    attachBookingHandlers();
}

function SaveActivityForRating(itinerary){
    const activityMap = new Map(); // To avoid duplicates based on activityId
    itinerary.days.forEach(day => {
        day.activities.forEach(activity => {
            if(activity.activityId){
                activityMap.set(activity.activityId, {        
                    Id: activity.activityId,
                    name: activity.placeName,
                });
            }
        });
    });
    localStorage.setItem('lastRatedActivities', JSON.stringify([...activityMap.values()]));
}

function getActivityIcon(type) {
    const icons = {
        'attraction': '🏛️',
        'food': '🍽️',
        'meal': '🍽️',
        'entertainment': '🎭',
        'market': '🛍️',
        'shopping': '🛍️',
        'park': '🌳',
        'transfer': '🚗',
        'tour': '🗺️',
        'hotel': '🏨'
    };
    return icons[type.toLowerCase()] || '📍';
}
function getWeatherIcon(condition) 
{
    const icons = 
    {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
    };
    return icons[condition.toLowerCase()] || '🌡️';
}

function attachBookingHandlers() {
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', async function () {
            const activityId = this.dataset.activityId;
            const cost = parseFloat(this.dataset.cost);

            this.disabled = true;
            this.textContent = 'Booking...';

            try {
                const bookingId = await createBooking({
                    tripId: currentTrip.tripId,
                    activityId: activityId,
                    amount: cost,
                    customerEmail: 'test@example.com'
                });

                this.textContent = 'Redirecting to payment...';
                const paymentUrl = await initiatePayment(bookingId);

                window.location.href = paymentUrl;

            } catch (error) {
                this.disabled = false;
                this.textContent = 'Book & Pay';
                alert('Booking failed. Please try again.');
                console.error(error);
            }
        });
    });
}