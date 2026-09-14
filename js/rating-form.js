function popularActivityDropdown(){
    const stored = localStorage.getItem('lastRatedActivities'); 
    const select = document.getElementById('activityId');
    if(!stored)
    {
        select.innerHTML = '<option value="">No activities found</option>';
        return;
    }
    const activities = JSON.parse(stored);
    if(activities.length === 0){
        select.innerHTML = '<option value="">No activities found</option>';
        return;
    }
    select.innerHTML = '<option value="">   -- Select an activity --   </option>';
    activities.forEach(activity => {
        const option = document.createElement('option');
        option.value = activity.yId;
        option.textContent = activity.name;
        select.appendChild(option);
    });
}
popularActivityDropdown();  
document.getElementById('ratingForm').addEventListener('submit',async function (e) {
    e.preventDefault();
    const submitbtn =  document.getElementById('submitRatingBtn');
    const resDiv = document.getElementById('ratingResult');

    const ratingData = {
        activityId:document.getElementById('activityId').value,
        customerEmail:document.getElementById('customerEmail').value,
        score:document.getElementById('score').value,
        comment:document.getElementById('comment').value || null
    }

    submitbtn.disabled  =true;
    submitbtn.textContent ="Submiting...";
    resDiv.className = '';
    resDiv.textContent ='';
    try{
        const ratingId = await CreateRaing(ratingData);
        resDiv.className = 'success';
        resDiv.textContent = 'Thanks For Rating.'
        document.getElementById('ratingForm').reset();

    }
    catch(error){
        resDiv.className = 'error';
        resDiv.textContent = error.message || 'Failed to submit rating.';
        console.log(error);

    }finally{
        submitbtn.disabled  =false;
        submitbtn.textContent ="Submit";

    }
})