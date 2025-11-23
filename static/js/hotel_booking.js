// Hotel Booking Logic
let currentHotelBooking = null;

function searchHotels() {
    const country = document.getElementById('hotel-country').value;
    const hotelName = document.getElementById('hotel-name').value;
    const roomType = document.getElementById('hotel-room-type').value;
    const hasBathtub = document.getElementById('hotel-bathtub').checked;
    const hasBreakfast = document.getElementById('hotel-breakfast').checked;

    if (!country || !hotelName) {
        alert('請選擇國家與飯店！');
        return;
    }

    // Mock Hotel Data
    const mockHotels = [
        {
            id: 1,
            name: hotelName,
            country: country,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
            rating: 4.8,
            price: 12000,
            desc: '享受頂級的住宿體驗，充滿庫洛米風格的奢華設計。'
        },
        {
            id: 2,
            name: hotelName + ' (別館)',
            country: country,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
            rating: 4.5,
            price: 9800,
            desc: '溫馨舒適的選擇，適合家庭與情侶入住。'
        }
    ];

    renderHotelResults(mockHotels, roomType, hasBathtub, hasBreakfast);
    router('hotel-results');
}

function renderHotelResults(hotels, roomType, hasBathtub, hasBreakfast) {
    const container = document.getElementById('hotel-list');
    document.getElementById('hotel-results-title').innerText = `搜尋結果：${hotels[0].country} - ${hotels[0].name}`;

    container.innerHTML = hotels.map(h => `
                <div class="bg-[#222] rounded-xl overflow-hidden border border-gray-700 hover:border-k-pink transition-all duration-300 flex flex-col md:flex-row group">
                    <div class="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                        <img src="${h.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute top-4 left-4 bg-k-pink text-white px-3 py-1 rounded font-bold text-sm">
                            ${h.rating} <i class="fa-solid fa-star text-xs"></i>
                        </div>
                    </div>
                    <div class="md:w-2/3 p-6 flex flex-col justify-between">
                        <div>
                            <h3 class="text-2xl font-bold mb-2 group-hover:text-k-pink transition">${h.name}</h3>
                            <p class="text-gray-400 mb-4">${h.desc}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span class="bg-[#333] text-gray-300 px-3 py-1 rounded text-sm border border-gray-600">
                                    ${roomType === 'standard' ? '標準房' : roomType === 'deluxe' ? '豪華房' : '行政套房'}
                                </span>
                                ${hasBathtub ? '<span class="bg-[#333] text-gray-300 px-3 py-1 rounded text-sm border border-gray-600"><i class="fa-solid fa-bath mr-1"></i> 有浴缸</span>' : ''}
                                ${hasBreakfast ? '<span class="bg-[#333] text-gray-300 px-3 py-1 rounded text-sm border border-gray-600"><i class="fa-solid fa-utensils mr-1"></i> 附早餐</span>' : ''}
                            </div>
                        </div>
                        <div class="flex justify-between items-end border-t border-gray-700 pt-4">
                            <div>
                                <div class="text-xs text-gray-500">每晚房價</div>
                                <div class="text-3xl font-bold text-k-pink">$${h.price.toLocaleString()}</div>
                            </div>
                            <button onclick='openHotelBooking(${JSON.stringify(h)}, "${roomType}", ${hasBathtub}, ${hasBreakfast})' 
                                class="btn-primary px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                                立即預訂
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
}

function openHotelBooking(hotel, roomType, hasBathtub, hasBreakfast) {
    currentHotelBooking = {
        hotel: hotel,
        roomType: roomType,
        hasBathtub: hasBathtub,
        hasBreakfast: hasBreakfast,
        nights: 4,
        tax: 2500
    };

    // Update Booking UI
    document.getElementById('booking-hotel-name').innerText = hotel.name;
    document.getElementById('booking-hotel-country').innerText = hotel.country;
    document.getElementById('booking-room-type').innerText = roomType === 'standard' ? '標準房' : roomType === 'deluxe' ? '豪華房' : '行政套房';
    document.getElementById('booking-has-bathtub').innerText = hasBathtub ? '有浴缸' : '無浴缸';
    document.getElementById('booking-has-breakfast').innerText = hasBreakfast ? '附早餐' : '不含早餐';

    const roomTotal = hotel.price * 4;
    document.getElementById('booking-room-price').innerText = `$${roomTotal.toLocaleString()}`;
    document.getElementById('booking-total-price').innerText = `$${(roomTotal + 2500).toLocaleString()}`;

    router('hotel-booking');
}

function confirmHotelBooking() {
    const bookingDetails = {
        type: 'hotel',
        data: currentHotelBooking,
        details: {
            total: document.getElementById('booking-total-price').innerText
        }
    };

    localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    router('checkout');
}
