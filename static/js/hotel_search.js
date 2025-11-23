// Search Tab Switcher
function switchSearchTab(tab) {
    // 1. Reset all tabs
    document.querySelectorAll('.search-tab').forEach(t => {
        t.classList.remove('active', 'text-white');
        t.classList.add('text-gray-400');
    });

    // 2. Hide all forms
    document.getElementById('flight-search-form').classList.add('hidden');
    document.getElementById('hotel-search-form').classList.add('hidden');
    document.getElementById('itinerary-search-form').classList.add('hidden');

    // 3. Activate selected tab
    const activeTab = document.getElementById(`tab-${tab}`);
    activeTab.classList.add('active', 'text-white');
    activeTab.classList.remove('text-gray-400');

    // 4. Show selected form
    document.getElementById(`${tab}-search-form`).classList.remove('hidden');
}

// Hotel Search Logic
const hotelsData = {
    'Japan': ['東京庫洛米大飯店', '大阪美樂蒂溫泉旅館', '京都酷企鵝町家'],
    'Korea': ['首爾粉紅骷髏酒店', '釜山搖滾海景飯店'],
    'Taiwan': ['台北信義區庫洛米行館', '高雄愛河美樂蒂會館']
};

function updateHotelOptions() {
    const country = document.getElementById('hotel-country').value;
    const hotelSelect = document.getElementById('hotel-name');

    hotelSelect.innerHTML = '<option value="">請選擇飯店</option>';

    if (country && hotelsData[country]) {
        hotelsData[country].forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel;
            option.innerText = hotel;
            hotelSelect.appendChild(option);
        });
    } else {
        hotelSelect.innerHTML = '<option value="">請先選擇國家</option>';
    }
}

function searchHotels() {
    const country = document.getElementById('hotel-country').value;
    const hotel = document.getElementById('hotel-name').value;
    const roomType = document.getElementById('hotel-room-type').value;
    const hasBathtub = document.getElementById('hotel-bathtub').checked;
    const hasBreakfast = document.getElementById('hotel-breakfast').checked;

    if (!country || !hotel) {
        alert('請選擇國家與飯店！');
        return;
    }

    alert(`搜尋條件：\n國家：${country}\n飯店：${hotel}\n房型：${roomType}\n浴缸：${hasBathtub ? '有' : '無'}\n早餐：${hasBreakfast ? '有' : '無'}\n\n(此功能為展示，尚未連接後端)`);
}
