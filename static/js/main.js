// Oracle Quiz Data
const oracleQuestions = [
    {
        q: "今天的心情是？",
        options: [
            { text: "想去陰森神秘的地方探險", type: "goth" },
            { text: "想在街頭釋放叛逆能量", type: "punk" },
            { text: "想徹夜狂歡不睡覺", type: "party" }
        ]
    },
    {
        q: "理想的旅伴是？",
        options: [
            { text: "吸血鬼或哥德少女", type: "goth" },
            { text: "搖滾樂手或刺青師", type: "punk" },
            { text: "派對動物或夜店 DJ", type: "party" }
        ]
    },
    {
        q: "最想體驗的活動？",
        options: [
            { text: "參觀地下墓穴或鬼屋", type: "goth" },
            { text: "去 Live House 看演出", type: "punk" },
            { text: "泡夜店或高空酒吧", type: "party" }
        ]
    }
];

const oracleResults = {
    goth: {
        destinations: ['paris', 'london', 'kyoto'],
        title: "歌德暗黑系",
        desc: "你的靈魂渴望神秘與歷史，適合探索古老的建築與傳說。"
    },
    punk: {
        destinations: ['tokyo', 'berlin', 'nyc'],
        title: "龐克叛逆系",
        desc: "你充滿街頭能量，需要音樂、塗鴉與地下文化的洗禮。"
    },
    party: {
        destinations: ['bangkok', 'seoul', 'taipei'],
        title: "夜生活狂歡系",
        desc: "你是夜的王者，霓虹燈與派對是你的歸屬。"
    }
};

let currentQuestionIndex = 0;
let oracleScores = { goth: 0, punk: 0, party: 0 };

function openOracle() {
    document.getElementById('oracle-modal').classList.add('active');
    resetOracle();
}

function closeOracle() {
    document.getElementById('oracle-modal').classList.remove('active');
}

function resetOracle() {
    currentQuestionIndex = 0;
    oracleScores = { goth: 0, punk: 0, party: 0 };
    showStage('oracle-intro');
}

function showStage(stageId) {
    document.querySelectorAll('.oracle-stage').forEach(s => s.classList.remove('active'));
    document.getElementById(stageId).classList.add('active');
}

function startOracle() {
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= oracleQuestions.length) {
        showLoading();
        return;
    }

    const question = oracleQuestions[currentQuestionIndex];
    document.getElementById('question-counter').innerText = `Question ${currentQuestionIndex + 1}/${oracleQuestions.length}`;
    document.getElementById('question-text').innerText = question.q;

    const optionsContainer = document.getElementById('question-options');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'oracle-option-btn';
        btn.innerText = option.text;
        btn.onclick = () => answerOracle(option.type);
        optionsContainer.appendChild(btn);
    });

    showStage('oracle-question');
}

function answerOracle(type) {
    oracleScores[type]++;
    currentQuestionIndex++;
    showQuestion();
}

function showLoading() {
    showStage('oracle-loading');
    setTimeout(showResult, 2000);
}

function showResult() {
    // Find the type with highest score
    let maxType = 'punk';
    let maxScore = 0;
    for (const [type, score] of Object.entries(oracleScores)) {
        if (score > maxScore) {
            maxScore = score;
            maxType = type;
        }
    }

    const result = oracleResults[maxType];
    const destId = result.destinations[Math.floor(Math.random() * result.destinations.length)];
    const destData = itineraries[destId];

    document.getElementById('result-destination').innerText = result.title;
    document.getElementById('result-description').innerText = result.desc;
    document.getElementById('result-image').src = destData.image;
    document.getElementById('result-btn').onclick = () => {
        closeOracle();
        showDetail(destId);
    };

    showStage('oracle-result');
}

// ========== WISHLIST SYSTEM ==========
let favorites = [];

function loadFavorites() {
    const stored = localStorage.getItem('kuromi_favorites');
    favorites = stored ? JSON.parse(stored) : [];
    updateFavoriteUI();
}

function saveFavorites() {
    localStorage.setItem('kuromi_favorites', JSON.stringify(favorites));
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }
    saveFavorites();
    updateFavoriteUI();
}

function updateFavoriteUI() {
    // Update heart icons
    document.querySelectorAll('.wishlist-heart').forEach(heart => {
        const id = heart.getAttribute('data-id');
        const icon = heart.querySelector('i');
        if (favorites.includes(id)) {
            icon.className = 'fa-solid fa-heart text-white text-xl';
            heart.classList.add('favorited');
        } else {
            icon.className = 'fa-regular fa-heart text-white text-xl';
            heart.classList.remove('favorited');
        }
    });

    // Update counter
    const counter = document.getElementById('favorites-counter');
    if (favorites.length > 0) {
        counter.innerText = favorites.length;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

function renderFavoritesPage() {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');

    if (favorites.length === 0) {
        empty.classList.remove('hidden');
        grid.innerHTML = '';
        return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = '';

    favorites.forEach(id => {
        const data = itineraries[id];
        if (!data) return;

        const card = `
                    <div class="bg-[#222] rounded-xl overflow-hidden card-hover cursor-pointer">
                        <div class="relative h-48" onclick="showDetail('${id}')">
                            <img src="${data.image}" class="w-full h-full object-cover opacity-80" loading="lazy">
                            <div class="wishlist-heart favorited" onclick="event.stopPropagation(); toggleFavorite('${id}')" data-id="${id}">
                                <i class="fa-solid fa-heart text-white text-xl"></i>
                            </div>
                        </div>
                        <div class="p-4" onclick="showDetail('${id}')">
                            <h3 class="font-bold text-lg mb-2 line-clamp-2">${data.title}</h3>
                            <div class="flex items-center justify-between">
                                <span class="text-k-pink font-bold text-xl">${data.price}</span>
                            </div>
                        </div>
                    </div>
                `;
        grid.insertAdjacentHTML('beforeend', card);
    });

    updateFavoriteUI();
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

// ========== PARALLAX EFFECT ==========
function initParallax() {
    const heroSection = document.querySelector('#home .relative.h-\\[500px\\]');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const bgDiv = heroSection.querySelector('.absolute.inset-0.bg-\\[url');
        if (bgDiv && scrolled < 600) {
            bgDiv.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ========== REVIEW DATA ==========
const reviews = {
    'tokyo': [
        { name: "黑暗公主", avatar: "👸", rating: 5, rebelIndex: 9, comment: "超叛逆！原宿的地下文化太酷了，庫洛米精選果然不同凡響！", date: "2024-01" },
        { name: "龐克小子", avatar: "🎸", rating: 5, rebelIndex: 10, comment: "澀谷的夜晚簡直是搖滾聖地，五星推薦！", date: "2024-02" },
        { name: "暗黑少女", avatar: "🖤", rating: 4, rebelIndex: 8, comment: "咖啡廳很有特色，但希望有更多自由時間。", date: "2024-03" }
    ],
    'london': [
        { name: "哥德女王", avatar: "👑", rating: 5, rebelIndex: 10, comment: "Camden Town 太讚了！每個角落都是驚喜。", date: "2024-01" },
        { name: "搖滾魂", avatar: "🤘", rating: 5, rebelIndex: 9, comment: "音樂朝聖之旅，值得！", date: "2024-02" }
    ],
    'paris': [
        { name: "吸血鬼伯爵", avatar: "🧛", rating: 5, rebelIndex: 10, comment: "地下墓穴探險太刺激了！", date: "2024-01" }
    ],
    'berlin': [
        { name: "電音狂", avatar: "🎧", rating: 5, rebelIndex: 10, comment: "Techno 派對震撼靈魂！", date: "2024-02" }
    ]
};

function getAverageRating(id) {
    const cityReviews = reviews[id] || [];
    if (cityReviews.length === 0) return 0;
    const sum = cityReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / cityReviews.length).toFixed(1);
}

function getAverageRebelIndex(id) {
    const cityReviews = reviews[id] || [];
    if (cityReviews.length === 0) return 0;
    const sum = cityReviews.reduce((acc, r) => acc + r.rebelIndex, 0);
    return Math.round(sum / cityReviews.length);
}

// Itinerary Data
// Itinerary Data - Injected from server
const itineraries = window.itineraries || {};


// Helper: Generate inline SVG as data URL (no external dependencies)
function generateColoredImage(color, text, width = 800, height = 600) {
    const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                    <rect width="${width}" height="${height}" fill="${color}"/>
                    <text x="50%" y="50%" text-anchor="middle" font-family="Arial, sans-serif" 
                          font-size="32" font-weight="bold" fill="white">${text}</text>
                </svg>
            `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Region mapping for itinerary filtering
const regionMap = {
    'japan': ['tokyo', 'osaka', 'kyoto', 'tokyo_neon'],
    'korea': ['seoul', 'seoul_underground'],
    'southeast-asia': ['bangkok', 'bangkok_midnight', 'singapore_future'],
    'europe': ['berlin', 'berlin_techno', 'london', 'paris', 'paris_gothic', 'prague_vampire', 'amsterdam_freedom', 'reykjavik_aurora']
};

// Filter itineraries by region
function filterByRegion(region) {
    const ids = regionMap[region];
    if (!ids) {
        // If region not found, show all
        router('search');
        renderItineraries();
        return;
    }

    // Filter itineraries based on region
    const filtered = {};
    ids.forEach(id => {
        if (itineraries[id]) {
            filtered[id] = itineraries[id];
        }
    });

    // Update page title based on region
    const regionNames = {
        'japan': '日本',
        'korea': '韓國',
        'southeast-asia': '東南亞',
        'europe': '歐洲'
    };

    // Navigate to search page and filter
    router('search');

    // Update breadcrumb
    const breadcrumb = document.querySelector('#search .bg-\\[\\#222\\] p');
    if (breadcrumb) {
        breadcrumb.innerHTML = `<a href="#" onclick="router('home')" class="hover:text-k-pink">首頁</a> > <span class="text-white">${regionNames[region]}旅遊</span>`;
    }

    // Render filtered itineraries
    renderItineraries(filtered);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// Render Itinerary List
function renderItineraries(data = null) {
    const container = document.getElementById('search-results-container');
    const title = document.getElementById('search-results-title');

    // Use provided data or all itineraries
    const items = data ? Object.entries(data) : Object.entries(itineraries);

    title.innerText = `搜尋結果：共 ${items.length} 筆行程`;
    container.innerHTML = ''; // Clear static content

    items.forEach(([id, data]) => {
        const html = `
        <div class="bg-[#222] rounded-lg overflow-hidden flex flex-col md:flex-row border border-transparent hover:border-[#9B72AA] transition group cursor-pointer mb-4"
    onclick="showDetail('${id}')">
                        <div class="w-full md:w-1/3 h-48 md:h-auto relative">
                            <img src="${data.image}" class="w-full h-full object-cover" loading="lazy">
                            <div class="wishlist-heart" onclick="event.stopPropagation(); toggleFavorite('${id}')" data-id="${id}">
                                <i class="fa-regular fa-heart text-white text-xl"></i>
                            </div>
                            ${Math.random() > 0.7 ? '<div class="absolute top-2 left-2 bg-k-pink text-white text-xs px-2 py-1 rounded-br-lg font-bold">熱銷</div>' : ''}
                        </div>
                        <div class="p-4 w-full md:w-2/3 flex flex-col justify-between">
                            <div>
                                <h3 class="text-xl font-bold mb-2 group-hover:text-k-pink transition">${data.title}</h3>
                                <div class="flex flex-wrap gap-2 mb-2">
                                    ${data.tags.map(tag => `<span class="text-xs bg-[#333] text-gray-300 px-2 py-1 rounded">${tag}</span>`).join('')}
                                </div>
                                <p class="text-sm text-gray-400 line-clamp-2">庫洛米嚴選！帶你體驗最不一樣的${data.tags[1] || '旅程'}之旅，絕對讓你印象深刻。</p>
                            </div>
                            <div class="flex justify-between items-end mt-4">
                                <div class="text-sm text-gray-500">可售日期: ${data.dates.slice(0, 3).join(', ')}</div>
                                <div class="text-right">
                                    <div class="text-gray-500 line-through text-sm">${data.originalPrice}</div>
                                    <div class="text-k-pink font-bold text-2xl">${data.price}</div>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
    updateFavoriteUI();
}

// Apply Filters
function applyFilters() {
    const priceFilters = Array.from(document.querySelectorAll('.filter-price:checked')).map(el => el.value);
    const themeFilters = Array.from(document.querySelectorAll('.filter-theme:checked')).map(el => el.value);
    const sortValue = document.getElementById('sort-select').value;

    let filtered = {};

    for (const [id, item] of Object.entries(itineraries)) {
        const price = parseInt(item.price.replace(/[$,]/g, ''));

        // Price Filter
        let priceMatch = false;
        if (priceFilters.length === 0) priceMatch = true;
        else {
            if (priceFilters.includes('low') && price < 20000) priceMatch = true;
            if (priceFilters.includes('mid') && price >= 20000 && price <= 40000) priceMatch = true;
            if (priceFilters.includes('high') && price > 40000) priceMatch = true;
        }

        // Theme Filter (Mock logic based on tags or title keywords)
        // Since we don't have explicit theme fields, we'll do a loose match or just pass all if 'shopping' is checked (default)
        // For better demo, let's just assume all match unless specific keywords are found
        let themeMatch = true;
        // In a real app, we would check item.tags or item.category

        if (priceMatch && themeMatch) {
            filtered[id] = item;
        }
    }

    // Sorting
    let sortedArray = Object.entries(filtered);
    if (sortValue === 'price-asc') {
        sortedArray.sort((a, b) => {
            return parseInt(a[1].price.replace(/[$,]/g, '')) - parseInt(b[1].price.replace(/[$,]/g, ''));
        });
    } else if (sortValue === 'price-desc') {
        sortedArray.sort((a, b) => {
            return parseInt(b[1].price.replace(/[$,]/g, '')) - parseInt(a[1].price.replace(/[$,]/g, ''));
        });
    }
    // popularity is default/random order

    // Convert back to object for renderItineraries (or modify renderItineraries to accept array)
    // My renderItineraries accepts object, so let's reconstruct
    let sortedObject = {};
    sortedArray.forEach(([key, val]) => sortedObject[key] = val);

    renderItineraries(sortedObject);
}

// Show Detail Page
function showDetail(id) {
    const data = itineraries[id];
    if (!data) return;

    // Set global ID for booking functions
    window.currentDetailId = id;

    const detailSection = document.getElementById('detail');

    // Generate HTML
    let tagsHtml = data.tags.map(tag => `<span class="bg-gray-700 text-white px-3 py-1 rounded text-sm">${tag}</span>`).join('');
    let datesHtml = data.dates.map(date => `<option value="${date}">${date} - ${data.price}</option>`).join('');

    let daysHtml = data.days.map(day => `
        <div class="relative pl-12 mb-8">
                    <div class="absolute left-0 top-1 w-10 h-10 bg-[#333] rounded-full flex items-center justify-center font-bold text-white border-4 border-[#1A1A1A] z-10">${day.day}</div>
                    <h3 class="text-xl font-bold text-white mb-2">${day.title}</h3>
                    <div class="bg-[#222] p-4 rounded-lg text-gray-300 border border-gray-700">
                        <p class="mb-2">${day.desc}</p>
                        ${day.stay ? `<p class="text-sm text-gray-400"><i class="fa-solid fa-bed mr-2"></i>住宿：${day.stay}</p>` : ''}
                        ${day.images ? `
                        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                            ${day.images.map(img => `<img src="${img}" class="rounded-lg h-40 w-full object-cover hover:opacity-90 transition" loading="lazy">`).join('')}
                        </div>` : ''}
                    </div>
                </div>
        `).join('');

    // Cost Breakdown Logic
    const basePrice = parseInt(data.price.replace(/[$,]/g, ''));
    const childPrice = Math.round(basePrice * 0.8);

    const costHtml = `
        <div class="bg-[#222] p-6 rounded-xl border border-gray-700 space-y-6">
                    <div>
                        <h3 class="text-xl font-bold text-white mb-4"><i class="fa-solid fa-wallet text-k-pink mr-2"></i>費用包含</h3>
                        <ul class="list-disc list-inside text-gray-300 space-y-2 ml-2">
                            <li>台北至目的地來回經濟艙機票 (含稅)</li>
                            <li>全程精選住宿 (兩人一室)</li>
                            <li>行程表列之交通、門票、餐食</li>
                            <li>500萬旅遊責任險 + 20萬醫療險</li>
                            <li>庫洛米專屬旅遊手冊與行李吊牌</li>
                        </ul>
                    </div>
                    <div class="border-t border-gray-700 pt-6">
                        <h3 class="text-xl font-bold text-white mb-4"><i class="fa-solid fa-coins text-k-pink mr-2"></i>票價說明</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-[#333] p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-white">成人票價</div>
                                    <div class="text-xs text-gray-400">12歲以上</div>
                                </div>
                                <div class="text-xl font-bold text-k-pink">$${basePrice.toLocaleString()}</div>
                            </div>
                            <div class="bg-[#333] p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-white">兒童票價</div>
                                    <div class="text-xs text-gray-400">2-12歲 (佔床)</div>
                                </div>
                                <div class="text-xl font-bold text-k-pink">$${childPrice.toLocaleString()}</div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">* 嬰兒 (2歲以下) 費用另計，請洽客服。</p>
                        <p class="text-xs text-gray-500">* 單人房差需補價差 $12,000。</p>
                    </div>
                </div>
        `;

    // Features HTML
    const featuresHtml = `
        <div class="bg-[#222] p-6 rounded-xl border border-gray-700">
                    <h3 class="text-2xl font-bold text-white mb-4">${data.title}</h3>
                    <p class="text-gray-300 leading-relaxed mb-6">${data.description || '這是一趟充滿驚喜與叛逆的旅程，專為渴望與眾不同的你設計。跟隨庫洛米的腳步，探索城市的另一面。'}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-[#333] p-4 rounded-lg text-center">
                            <i class="fa-solid fa-camera text-3xl text-k-pink mb-2"></i>
                            <h4 class="font-bold text-white">絕美打卡點</h4>
                            <p class="text-xs text-gray-400">精選IG熱門景點</p>
                        </div>
                        <div class="bg-[#333] p-4 rounded-lg text-center">
                            <i class="fa-solid fa-utensils text-3xl text-k-pink mb-2"></i>
                            <h4 class="font-bold text-white">在地美食</h4>
                            <p class="text-xs text-gray-400">巷弄隱藏版美味</p>
                        </div>
                        <div class="bg-[#333] p-4 rounded-lg text-center">
                            <i class="fa-solid fa-hotel text-3xl text-k-pink mb-2"></i>
                            <h4 class="font-bold text-white">特色旅宿</h4>
                            <p class="text-xs text-gray-400">住進設計師的家</p>
                        </div>
                    </div>
                </div>
        `;

    detailSection.innerHTML = `
        <div class="bg-[#222] py-4 border-b border-[#3E204F]">
            <div class="container mx-auto px-4">
                <p class="text-gray-400 text-sm"><a href="#" onclick="router('home')" class="hover:text-k-pink">首頁</a> > <a href="#" onclick="router('search')" class="hover:text-k-pink">行程搜尋</a> > <span class="text-white">${data.title}</span></p>
            </div>
                </div>
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col lg:flex-row gap-8">
                <div class="w-full lg:w-2/3">
                    <h1 class="text-3xl font-bold mb-4 text-white leading-tight">${data.title}</h1>
                    <div class="flex gap-3 mb-6">${tagsHtml}</div>
                    <div class="rounded-xl overflow-hidden mb-8 h-[400px] shadow-lg border border-gray-800">
                        <img src="${data.image}" class="w-full h-full object-cover" loading="lazy">
                    </div>

                    <!-- Tabs -->
                    <div class="border-b border-gray-700 mb-6 flex">
                        <button onclick="switchDetailTab('features')" id="tab-btn-features" class="px-6 py-3 text-k-pink border-b-2 border-k-pink font-bold transition-colors hover:bg-[#333]">行程特色</button>
                        <button onclick="switchDetailTab('itinerary')" id="tab-btn-itinerary" class="px-6 py-3 text-gray-400 hover:text-white transition-colors hover:bg-[#333]">每日行程</button>
                        <button onclick="switchDetailTab('cost')" id="tab-btn-cost" class="px-6 py-3 text-gray-400 hover:text-white transition-colors hover:bg-[#333]">費用說明</button>
                    </div>

                    <!-- Tab Contents -->
                    <div id="tab-content-features" class="tab-content block animate-fade-in">
                        ${featuresHtml}
                    </div>
                    <div id="tab-content-itinerary" class="tab-content hidden animate-fade-in space-y-8 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-gray-700">
                        ${daysHtml}
                    </div>
                    <div id="tab-content-cost" class="tab-content hidden animate-fade-in">
                        ${costHtml}
                    </div>
                </div>

                <!-- Booking Widget -->
                <div class="w-full lg:w-1/3">
                    <div class="bg-[#222] rounded-xl p-6 sticky top-24 border border-[#3E204F] shadow-2xl">
                        <h3 class="text-xl font-bold mb-4">選擇出發日期</h3>
                        <div class="mb-4">
                            <select id="booking-date" class="w-full p-3 rounded bg-[#333] border border-gray-600 text-white focus:border-k-pink outline-none">${datesHtml}</select>
                        </div>
                        <div class="flex justify-between items-center mb-4 bg-[#333] p-3 rounded">
                            <span class="text-gray-300">成人 <span class="text-xs text-gray-500">($${basePrice.toLocaleString()})</span></span>
                            <div class="flex items-center gap-3">
                                <button onclick="updatePax('${id}', 'adult', -1)" class="w-8 h-8 rounded-full bg-[#444] hover:bg-gray-500 text-white transition">-</button>
                                <span id="booking-adult-count" class="font-bold w-4 text-center">2</span>
                                <button onclick="updatePax('${id}', 'adult', 1)" class="w-8 h-8 rounded-full bg-[#444] hover:bg-gray-500 text-white transition">+</button>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-6 bg-[#333] p-3 rounded">
                            <span class="text-gray-300">兒童 <span class="text-xs text-gray-500">($${childPrice.toLocaleString()})</span></span>
                            <div class="flex items-center gap-3">
                                <button onclick="updatePax('${id}', 'child', -1)" class="w-8 h-8 rounded-full bg-[#444] hover:bg-gray-500 text-white transition">-</button>
                                <span id="booking-child-count" class="font-bold w-4 text-center">0</span>
                                <button onclick="updatePax('${id}', 'child', 1)" class="w-8 h-8 rounded-full bg-[#444] hover:bg-gray-500 text-white transition">+</button>
                            </div>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mb-6">
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-gray-300">總金額</span>
                                <span id="booking-total-price" class="text-3xl font-black text-k-pink">${data.price}</span>
                            </div>
                        </div>
                        <button onclick="bookItinerary('${id}')" class="w-full btn-primary py-4 rounded-lg font-bold text-xl mb-2 shadow-lg hover:shadow-k-pink/50 transition">立即預訂</button>
                        <p class="text-xs text-center text-gray-500"><i class="fa-solid fa-check-circle text-green-500"></i> 即時確認機位</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize price calculation
    updateTotalPrice(id);
    router('detail');
}

// Switch Detail Tabs
window.switchDetailTab = function (tabName) {
    // Reset buttons
    ['features', 'itinerary', 'cost'].forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const content = document.getElementById(`tab-content-${t}`);

        if (t === tabName) {
            btn.classList.add('text-k-pink', 'border-b-2', 'border-k-pink');
            btn.classList.remove('text-gray-400');
            content.classList.remove('hidden');
            content.classList.add('block');
        } else {
            btn.classList.remove('text-k-pink', 'border-b-2', 'border-k-pink');
            btn.classList.add('text-gray-400');
            content.classList.add('hidden');
            content.classList.remove('block');
        }
    });
};

function updatePax(id, type, change) {
    const el = document.getElementById(`booking-${type}-count`);
    if (!el) return;

    let count = parseInt(el.innerText);
    count += change;
    if (count < 0) count = 0;
    if (type === 'adult' && count < 1) count = 1; // Min 1 adult
    el.innerText = count;

    updateTotalPrice(id);
}

function updateTotalPrice(id) {
    const data = itineraries[id];
    if (!data) return;

    const adultEl = document.getElementById('booking-adult-count');
    const childEl = document.getElementById('booking-child-count');
    const priceEl = document.getElementById('booking-total-price');

    if (!adultEl || !childEl || !priceEl) return;

    const adultCount = parseInt(adultEl.innerText);
    const childCount = parseInt(childEl.innerText);

    const basePrice = parseInt(data.price.replace(/[$,]/g, ''));
    const total = (basePrice * adultCount) + (Math.round(basePrice * 0.8) * childCount);

    priceEl.innerText = '$' + total.toLocaleString();
}

function bookItinerary(id) {
    const data = itineraries[id];
    const date = document.getElementById('booking-date').value;
    const adultCount = parseInt(document.getElementById('booking-adult-count').innerText);
    const childCount = parseInt(document.getElementById('booking-child-count').innerText);
    const totalPrice = document.getElementById('booking-total-price').innerText;

    localStorage.setItem('currentBooking', JSON.stringify({
        type: 'itinerary',
        data: data,
        details: {
            date: date,
            adults: adultCount,
            children: childCount,
            total: totalPrice
        }
    }));
    router('checkout');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
}

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
// Global Hotels Data - Diverse options for worldwide destinations
const hotelsData = {
    // Asia
    'Japan': [
        '東京庫洛米霓虹酒店', '東京澀谷賽博龐克旅店', '東京六本木藝術飯店',
        '大阪美樂蒂溫泉旅館', '大阪道頓堀暗黑主題酒店',
        '京都酷企鵝町家', '京都哥德式禪意旅宿'
    ],
    'Korea': [
        '首爾弘大創意旅店', '首爾江南音樂酒店', '首爾明洞時尚飯店',
        '釜山海雲台搖滾旅館', '釜山南浦洞設計酒店',
        '濟州島火山景觀度假村'
    ],
    'Thailand': [
        '曼谷考山路背包客棧', '曼谷暹羅廣場精品酒店', '曼谷素坤逸藝術旅店',
        '清邁古城文青旅館', '芭達雅海灘派對酒店',
        '普吉島卡塔沙灘度假村'
    ],
    'Singapore': [
        '新加坡濱海灣設計酒店', '新加坡烏節路豪華飯店',
        '新加坡唐人街精品旅店', '聖淘沙度假村'
    ],
    'Taiwan': [
        '台北信義區庫洛米行館', '台北西門町潮流旅店', '台北東區時尚飯店',
        '高雄愛河美樂蒂會館', '台中逢甲夜市青年旅館',
        '台南安平古蹟民宿'
    ],

    // Europe
    'Germany': [
        '柏林Kreuzberg藝術旅店', '柏林Mitte工業風酒店',
        '慕尼黑瑪麗安廣場飯店', '漢堡港區設計旅館'
    ],
    'France': [
        '巴黎瑪黑區精品旅店', '巴黎蒙馬特藝術酒店', '巴黎拉丁區哥德飯店',
        '尼斯蔚藍海岸度假村', '里昂舊城區精品旅館'
    ],
    'Czech Republic': [
        '布拉格舊城哥德旅店', '布拉格城堡區精品酒店',
        '布拉格查理大橋景觀飯店'
    ],
    'Netherlands': [
        '阿姆斯特丹運河區精品旅店', '阿姆斯特丹Jordaan設計酒店',
        '鹿特丹現代建築飯店'
    ],
    'Iceland': [
        '雷克雅維克設計旅店', '維克黑沙灘Lodge',
        'Jokulsarlon冰河湖小屋', '藍湖溫泉度假村'
    ],
    'UK': [
        '倫敦Shoreditch嘻哈旅店', '倫敦Camden龐克酒店', '倫敦蘇活區精品飯店',
        '愛丁堡城堡區旅館', '曼徹斯特音樂主題酒店'
    ],
    'Spain': [
        '巴塞隆納哥德區旅店', '馬德里太陽門廣場飯店',
        '塞維亞佛朗明哥主題酒店', '伊比薩島派對度假村'
    ],
    'Italy': [
        '羅馬競技場景觀酒店', '佛羅倫斯藝術區精品旅店',
        '威尼斯運河旁貢多拉飯店', '米蘭時尚設計酒店'
    ],

    // Americas
    'USA': [
        '紐約布魯克林Loft旅店', '紐約曼哈頓SoHo精品酒店', '紐約哈林爵士飯店',
        '洛杉磯Santa Monica海灘旅館', '洛杉磯好萊塢星光飯店',
        '舊金山嬉皮區彩虹旅店', '拉斯維加斯Strip大道賭場酒店',
        '邁阿密South Beach派對酒店', '西雅圖咖啡文化旅館'
    ],
    'Mexico': [
        '墨西哥城歷史中心旅店', '墨西哥城亡靈節主題酒店',
        '瓜納華托彩色小鎮旅館', '坎昆加勒比海度假村'
    ],
    'Brazil': [
        '里約Copacabana海灘酒店', '里約森巴主題旅店',
        '聖保羅藝術區精品飯店', 'Salvador巴西古城旅館'
    ],
    'Argentina': [
        '布宜諾斯艾利斯探戈酒店', '巴塔哥尼亞冰川小屋'
    ],

    // Oceania
    'Australia': [
        '雪梨環形碼頭海港飯店', '雪梨The Rocks歷史旅店', '雪梨Bondi海灘衝浪旅館',
        '墨爾本咖啡文化精品酒店', '布里斯班南岸度假村',
        '黃金海岸衝浪者天堂飯店', '凱恩斯大堡礁潛水旅館'
    ],
    'New Zealand': [
        '奧克蘭天空塔景觀酒店', '奧克蘭Waiheke島酒莊旅館',
        '羅托魯瓦地熱溫泉飯店', '皇后鎮極限運動旅店',
        '威靈頓文化藝術酒店'
    ],

    // Africa & Middle East
    'Egypt': [
        '開羅尼羅河畔旅店', '開羅吉薩金字塔景觀酒店',
        '亞歷山大港地中海飯店', '路克索帝王谷旅館'
    ],
    'UAE': [
        '杜拜Burj Al Arab帆船酒店', '杜拜Marina區奢華飯店',
        '杜拜沙漠營地帳篷旅館', '阿布達比濱海大道酒店'
    ],
    'Morocco': [
        '馬拉喀什Riad傳統庭院旅店', '馬拉喀什Medina老城飯店',
        '撒哈拉沙漠豪華帳篷營地', '非斯古城迷宮旅館'
    ],
    'South Africa': [
        '開普敦V&A Waterfront飯店', '開普敦桌山景觀酒店',
        'Kruger國家公園Safari Lodge', '約翰尼斯堡市中心旅館'
    ]
};

// Itinerary Search Logic
function searchItinerariesFromHome() {
    const origin = document.getElementById('itinerary-origin').value;
    const dest = document.getElementById('itinerary-dest').value.toLowerCase();
    const date = document.getElementById('itinerary-date').value;

    // Filter logic
    let filtered = {};
    let count = 0;

    for (const [id, item] of Object.entries(itineraries)) {
        let match = true;

        // Destination filter (loose match on title or tags)
        if (dest) {
            const titleMatch = item.title.toLowerCase().includes(dest);
            const tagMatch = item.tags.some(t => t.toLowerCase().includes(dest));
            if (!titleMatch && !tagMatch) match = false;
        }

        // Date filter (check if any available date is after or equal to selected date)
        if (date && match) {
            const selectedDate = new Date(date);
            const hasValidDate = item.dates.some(d => new Date(d) >= selectedDate);
            if (!hasValidDate) match = false;
        }

        // Origin filter (optional, assuming packages might have origin info in tags or description)
        // For now, we'll ignore origin as most packages are round trip from main hubs, 
        // or we can check if tags contain the origin code if we added it to tags.
        // Let's just log it for now.

        if (match) {
            filtered[id] = item;
            count++;
        }
    }

    if (count === 0) {
        alert('找不到符合條件的行程，顯示所有熱門行程。');
        renderItineraries(itineraries); // Show all if none found
    } else {
        renderItineraries(filtered);
    }

    router('search');
}

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
    document.getElementById('hotel-results-title').innerText = `搜尋結果：${hotels[0].country} - ${hotels[0].name} `;

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

// Payment Processing
function processPayment() {
    const bookingData = localStorage.getItem('currentBooking');

    if (!bookingData) {
        alert('找不到訂單資訊！');
        return;
    }

    const booking = JSON.parse(bookingData);

    // Generate order number
    const orderNumber = 'KM' + Date.now().toString().slice(-10);
    const paymentTime = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Populate success page
    const detailsContainer = document.getElementById('success-booking-details');
    let detailsHTML = '';

    if (booking.type === 'flight') {
        const flight = booking.data;
        const details = booking.details;
        detailsHTML = `
        <div class="pb-4 border-b border-gray-700">
                        <h3 class="font-bold text-lg mb-2">${flight.airline} ${flight.flightNo}</h3>
                        <div class="text-sm text-gray-400 space-y-1">
                            <p><i class="fa-solid fa-plane-departure mr-2 text-k-pink"></i> ${flight.dep} - ${flight.arr}</p>
                            <p><i class="fa-solid fa-clock mr-2 text-k-pink"></i> ${flight.duration}</p>
                            <p><i class="fa-solid fa-chair mr-2 text-k-pink"></i> ${details.cabin === 'economy' ? '經濟艙' : details.cabin === 'business' ? '商務艙' : '頭等艙'} - 座位 ${details.seat}</p>
                            <p><i class="fa-solid fa-utensils mr-2 text-k-pink"></i> ${details.meal}</p>
                        </div>
                    </div>
        `;
    } else if (booking.type === 'hotel') {
        const data = booking.data;
        detailsHTML = `
        <div class="pb-4 border-b border-gray-700">
                        <h3 class="font-bold text-lg mb-2">${data.hotel.name}</h3>
                        <div class="text-sm text-gray-400 space-y-1">
                            <p><i class="fa-solid fa-location-dot mr-2 text-k-pink"></i> ${data.hotel.country}</p>
                            <p><i class="fa-solid fa-bed mr-2 text-k-pink"></i> ${data.roomType === 'standard' ? '標準房' : data.roomType === 'deluxe' ? '豪華房' : '行政套房'}</p>
                            <p><i class="fa-solid fa-calendar mr-2 text-k-pink"></i> 2023/12/20 - 12/24 (4晚)</p>
                            <p><i class="fa-solid fa-check mr-2 text-k-pink"></i> ${data.hasBathtub ? '浴缸' : ''} ${data.hasBreakfast ? '早餐' : ''}</p>
                        </div>
                    </div>
        `;
    } else if (booking.type === 'itinerary') {
        const itinerary = booking.data;
        const details = booking.details;
        detailsHTML = `
        <div class="pb-4 border-b border-gray-700">
                        <h3 class="font-bold text-lg mb-2">${itinerary.title}</h3>
                        <div class="text-sm text-gray-400 space-y-1">
                            <p><i class="fa-solid fa-calendar-check mr-2 text-k-pink"></i> 出發日期：${details.date}</p>
                            <p><i class="fa-solid fa-users mr-2 text-k-pink"></i> 成人 ${details.adults} 位${details.children > 0 ? ' / 兒童 ' + details.children + ' 位' : ''}</p>
                            <p><i class="fa-solid fa-tags mr-2 text-k-pink"></i> ${itinerary.tags.join(' / ')}</p>
                        </div>
                    </div>
        `;
    }

    detailsContainer.innerHTML = detailsHTML;
    document.getElementById('success-order-number').innerText = orderNumber;
    document.getElementById('success-payment-time').innerText = paymentTime;
    document.getElementById('success-total-amount').innerText = booking.details.total;

    // Clear booking from localStorage
    localStorage.removeItem('currentBooking');

    // Navigate to success page
    router('payment-success');
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

// Simple SPA Router
// Simple SPA Router
function router(pageId) {
    // 1. Check if target exists
    const target = document.getElementById(pageId);

    // If target doesn't exist (e.g. we are on a sub-page), redirect to home
    if (!target) {
        if (pageId === 'home') {
            window.location.href = '/';
        } else {
            window.location.href = '/#' + pageId;
        }
        return;
    }

    // 2. Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 3. Show target section
    target.classList.add('active');

    // 4. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. Special handling for page loads
    if (pageId === 'checkout') {
        loadCheckoutDetails();
    } else if (pageId === 'favorites') {
        renderFavoritesPage();
    }
}

// ... (existing code) ...

// Initialize
// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Clear any existing booking data on page load for fresh start
    localStorage.removeItem('currentBooking');


    renderItineraries();
    loadFavorites(); // Load wishlist from localStorage
    initScrollAnimations(); // Init scroll observer
    initParallax(); // Init parallax effect

    // Handle Hash Routing ONLY on Home Page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const hash = window.location.hash.substring(1);
        if (hash) {
            router(hash);
        } else {
            router('home'); // Default to home page
        }
    }

    // Update cart badge
    updateCartBadge();

    // Flight meal selection listener
    const mealSelect = document.getElementById('flight-meal');
    if (mealSelect) {
        mealSelect.addEventListener('change', updateBookingUI);
    }
});

// Flight Search System
// Global Airlines Network - Worldwide flight options
const airlinesData = {
    // Sanrio Theme Airlines
    'Kuromi Air': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=KuromiAir',
        name: 'Kuromi Air',
        desc: '最叛逆的飛行體驗，提供暗黑哥德風主題餐點與專屬搖滾頻道。全球航線覆蓋東京、首爾、柏林、紐約等潮流城市。',
        features: ['龐克搖滾播放清單', '骷髏頭造型餐具', '專屬叛逆空服員', '全球WiFi', '哥德風機艙']
    },
    'Melody Airways': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=MelodyAir',
        name: 'Melody Airways',
        desc: '粉紅夢幻的空中之旅，充滿蕾絲與花朵的浪漫氛圍。飛往巴黎、里約、雪梨等浪漫目的地。',
        features: ['粉紅香檳無限暢飲', '花香精油熱毛巾', '古典樂舒壓頻道', '玫瑰花瓣迎賓', '夢幻座艙']
    },
    'Badtz-Maru Jet': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=XOJet',
        name: 'Badtz-Maru Jet',
        desc: '酷企鵝的帥氣專機，極簡黑白風格，個性十足。主飛航線：東京-洛杉磯、首爾-紐約、新加坡-倫敦。',
        features: ['XO醬高級飛機餐', '黑白棋娛樂系統', '帥氣墨鏡租借', 'VR遊戲', '極簡設計座艙']
    },

    // Additional Global Carriers
    'Cinnamoroll Sky': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CinnamorollSky',
        name: 'Cinnamoroll Sky',
        desc: '雲朵般輕柔的飛行體驗，專飛冰島、紐西蘭等夢幻自然景觀航線。',
        features: ['雲朵造型座椅', '肉桂卷點心', '極光觀賞艙', '兒童遊樂區', '寵物友善']
    },
    'Pompompurin Express': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Pompompurin',
        name: 'Pompompurin Express',
        desc: '舒適悠閒的布丁狗航空，主打歐洲城市跳島，巴黎-阿姆斯特丹-布拉格航線。',
        features: ['布丁甜點吧', '懶人躺椅', '下午茶服務', '歐洲美食', '舒壓按摩']
    },
    'Little Twin Stars Galaxy': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TwinStars',
        name: 'Little Twin Stars Galaxy',
        desc: '星空主題長程航線，專飛跨洲際航班：東京-紐約、巴黎-雪梨、杜拜-洛杉磯。',
        features: ['星空投影天花板', '太空艙座椅', '無重力體驗', '天文望遠鏡', '星座雞尾酒']
    },
    'Keroppi Frog Air': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Keroppi',
        name: 'Keroppi Frog Air',
        desc: '環保生態航空，飛往生態旅遊勝地：哥斯大黎加、巴西亞馬遜、澳洲大堡礁。',
        features: ['有機餐點', '碳中和飛行', '生態紀錄片', '雨林音樂', '環保紀念品']
    },
    'Gudetama Lazy Flight': {
        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Gudetama',
        name: 'Gudetama Lazy Flight',
        desc: '慵懶蛋黃哥航空，主打紅眼航班與超長程航線，提供最舒適的睡眠體驗。',
        features: ['全平躺臥鋪', '蛋料理吧', '靜音艙', '睡眠香氛', '無限賴床時間']
    }
};

let currentFlight = null;
let selectedCabin = 'economy';
let selectedSeat = null;
let selectedMeal = 'standard';

function searchFlights() {
    const origin = document.getElementById('flight-origin').value;
    const dest = document.getElementById('flight-dest').value;
    const date = document.getElementById('flight-date').value;
    const airline = document.getElementById('flight-airline').value;

    // Mock Data Generation
    const mockFlights = [
        { id: 1, airline: 'Kuromi Air', flightNo: 'KA666', dep: '09:00', arr: '13:00', duration: '4h 00m', price: 12000 },
        { id: 2, airline: 'Melody Airways', flightNo: 'MA520', dep: '14:30', arr: '18:45', duration: '4h 15m', price: 13500 },
        { id: 3, airline: 'Badtz-Maru Jet', flightNo: 'XO888', dep: '19:00', arr: '23:00', duration: '4h 00m', price: 11800 },
        { id: 4, airline: 'Kuromi Air', flightNo: 'KA999', dep: '23:30', arr: '03:30', duration: '4h 00m', price: 10500 }
    ];

    // Filter (Mock logic)
    let results = mockFlights;
    if (airline !== 'all') {
        results = results.filter(f => f.airline === airlinesData[airline].name);
    }

    renderFlightResults(results, origin, dest, date);
    router('flight-results');
}

function renderFlightResults(flights, origin, dest, date) {
    const container = document.getElementById('flight-list');
    document.getElementById('flight-results-title').innerText = `搜尋結果：${origin} 往 ${dest} (${date})`;

    if (flights.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">找不到符合條件的航班</div>';
        return;
    }

    container.innerHTML = flights.map(f => `
        <div class="bg-[#222] rounded-xl overflow-hidden border border-gray-700 hover:border-k-pink transition-all duration-300 flex flex-col md:flex-row group">
                    <div class="md:w-1/4 bg-[#2A2A2A] p-6 flex flex-col items-center justify-center border-r border-gray-700 relative overflow-hidden">
                        <div class="absolute inset-0 bg-k-pink/5 group-hover:bg-k-pink/10 transition-colors"></div>
                        <img src="${airlinesData[f.airline].logo}" class="w-16 h-16 mb-2 rounded-full bg-white p-1">
                        <span class="font-bold text-lg relative z-10">${f.airline}</span>
                        <span class="text-xs text-gray-400 relative z-10">${f.flightNo}</span>
                        <button onclick="showAirlineInfo('${f.airline}')" class="text-xs text-k-pink mt-2 hover:underline relative z-10"><i class="fa-solid fa-circle-info"></i> 航空資訊</button>
                    </div>
                    <div class="md:w-2/4 p-6 flex flex-col justify-center">
                        <div class="flex justify-between items-center mb-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold">${f.dep}</div>
                                <div class="text-sm text-gray-400">${origin}</div>
                            </div>
                            <div class="flex-1 px-4 flex flex-col items-center">
                                <div class="text-xs text-gray-500 mb-1">${f.duration}</div>
                                <div class="w-full h-[2px] bg-gray-600 relative">
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-k-pink rounded-full"></div>
                                </div>
                                <div class="text-xs text-k-pink mt-1">直飛</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold">${f.arr}</div>
                                <div class="text-sm text-gray-400">${dest}</div>
                            </div>
                        </div>
                    </div>
                    <div class="md:w-1/4 p-6 flex flex-col justify-center items-end bg-[#252525] border-l border-gray-700">
                        <div class="text-3xl font-bold text-k-pink mb-1">$${f.price.toLocaleString()}</div>
                        <div class="text-xs text-gray-500 mb-4">經濟艙 / 每人</div>
                        <button onclick='openFlightBooking(${JSON.stringify(f)})' class="btn-primary w-full py-3 rounded-lg font-bold hover:scale-105 transition-transform">立即預訂</button>
                    </div>
                </div>
        `).join('');
}

function showAirlineInfo(airlineName) {
    const data = airlinesData[airlineName];
    if (!data) return;
    document.getElementById('modal-airline-logo').src = data.logo;
    document.getElementById('modal-airline-name').innerText = data.name;
    document.getElementById('modal-airline-desc').innerText = data.desc;
    document.getElementById('modal-airline-features').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('airline-modal').classList.remove('hidden');
    document.getElementById('airline-modal').classList.add('flex');
}

function closeAirlineModal() {
    document.getElementById('airline-modal').classList.add('hidden');
    document.getElementById('airline-modal').classList.remove('flex');
}

function openFlightBooking(flight) {
    currentFlight = flight;
    selectedCabin = 'economy';
    selectedSeat = null;
    selectedMeal = 'standard';

    // Update UI for booking page
    updateBookingUI();
    renderSeatMap();

    router('flight-booking');
}

function selectCabin(cabin) {
    selectedCabin = cabin;
    document.querySelectorAll('.cabin-btn').forEach(btn => {
        btn.classList.remove('border-k-pink', 'bg-k-pink/10');
        btn.classList.add('border-gray-600');
    });
    const btn = document.getElementById(`btn-${cabin}`);
    btn.classList.remove('border-gray-600');
    btn.classList.add('border-k-pink', 'bg-k-pink/10');

    updateBookingUI();
}

function renderSeatMap() {
    const map = document.getElementById('seat-map');
    map.innerHTML = '';

    const rows = 10;
    const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];

    for (let i = 1; i <= rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex gap-2 mb-2';

        cols.forEach(col => {
            if (col === '') {
                const aisle = document.createElement('div');
                aisle.className = 'w-8 text-center text-gray-600 text-xs flex items-center justify-center';
                aisle.innerText = i;
                rowDiv.appendChild(aisle);
            } else {
                const seatId = `${i}${col}`;
                const isOccupied = Math.random() < 0.3;
                const seat = document.createElement('button');
                seat.className = `w-10 h-10 rounded flex items-center justify-center text-xs font-bold transition-colors ${isOccupied ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                    (selectedSeat === seatId ? 'bg-k-pink text-white' : 'bg-[#333] border border-gray-600 hover:border-k-pink text-gray-300')
                    }`;
                seat.innerText = col;
                if (!isOccupied) {
                    seat.onclick = () => selectSeat(seatId);
                } else {
                    seat.disabled = true;
                }
                rowDiv.appendChild(seat);
            }
        });
        map.appendChild(rowDiv);
    }
}

function selectSeat(seatId) {
    selectedSeat = seatId;
    renderSeatMap(); // Re-render to update styles
    updateBookingUI();
}

function updateBookingUI() {
    if (!currentFlight) return;

    // Prices
    const basePrice = currentFlight.price;
    const multipliers = { 'economy': 1, 'business': 2.5, 'first': 4 };

    document.getElementById('price-economy').innerText = `$${basePrice.toLocaleString()}`;
    document.getElementById('price-business').innerText = `$${(basePrice * 2.5).toLocaleString()}`;
    document.getElementById('price-first').innerText = `$${(basePrice * 4).toLocaleString()}`;

    // Summary
    const cabinPrice = basePrice * multipliers[selectedCabin];
    const tax = 500;
    const total = cabinPrice + tax;

    const summary = document.getElementById('booking-summary-content');
    summary.innerHTML = `
        <div class="flex justify-between">
                    <span>航班</span>
                    <span class="font-bold text-white">${currentFlight.airline} ${currentFlight.flightNo}</span>
                </div>
                <div class="flex justify-between">
                    <span>艙等</span>
                    <span class="font-bold text-white capitalize">${selectedCabin === 'economy' ? '經濟艙' : selectedCabin === 'business' ? '商務艙' : '頭等艙'}</span>
                </div>
                <div class="flex justify-between">
                    <span>座位</span>
                    <span class="font-bold text-k-pink">${selectedSeat || '未選擇'}</span>
                </div>
                <div class="flex justify-between">
                    <span>餐點</span>
                    <span class="font-bold text-white">${document.getElementById('flight-meal').options[document.getElementById('flight-meal').selectedIndex].text}</span>
                </div>
                <div class="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span>稅金 & 費用</span>
                    <span>$${tax}</span>
                </div>
    `;

    document.getElementById('flight-total-price').innerText = `$${total.toLocaleString()}`;
}

function confirmFlightBooking() {
    if (!selectedSeat) {
        alert('請選擇座位！');
        return;
    }

    const bookingDetails = {
        type: 'flight',
        data: currentFlight,
        details: {
            cabin: selectedCabin,
            seat: selectedSeat,
            meal: document.getElementById('flight-meal').value,
            total: document.getElementById('flight-total-price').innerText
        }
    };

    localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    router('checkout');
}

// Load Checkout Details
function loadCheckoutDetails() {
    const bookingData = localStorage.getItem('currentBooking');
    const orderSummary = document.getElementById('order-summary');
    const totalAmount = document.getElementById('order-total');
    const emptyCart = document.getElementById('empty-cart');
    const checkoutContent = document.getElementById('checkout-content');

    // If no booking data, show empty cart state
    if (!bookingData) {
        emptyCart.classList.remove('hidden');
        checkoutContent.classList.add('hidden');
        return;
    }

    // Show checkout content, hide empty cart
    emptyCart.classList.add('hidden');
    checkoutContent.classList.remove('hidden');

    const booking = JSON.parse(bookingData);

    if (booking.type === 'flight') {
        const flight = booking.data;
        const details = booking.details;

        orderSummary.innerHTML = `
        <div class="flex justify-between mb-2">
                <span>機票 (${flight.airline})</span>
                <span class="font-bold text-white">${flight.airline} ${flight.flightNo}</span>
            </div>
            <div class="flex justify-between mb-2 text-sm text-gray-400">
                <span>艙等 (${details.cabin})</span>
                <span>${details.cabin === 'economy' ? '包含' : '升等費'}</span>
            </div>
             <div class="flex justify-between mb-2 text-sm text-gray-400">
                <span>稅金 & 費用</span>
                <span>$500</span>
            </div>
    `;
        totalAmount.innerText = details.total;
    } else if (booking.type === 'hotel') {
        const data = booking.data;
        const details = booking.details;

        orderSummary.innerHTML = `
        <div class="mb-4 border-b border-gray-700 pb-2">
                <h4 class="font-bold text-sm mb-1">${data.hotel.name}</h4>
                <p class="text-xs text-gray-400">2023/12/20 - 12/24 (4晚)</p>
            </div>
            <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">房型</span>
                <span>${data.roomType === 'standard' ? '標準房' : data.roomType === 'deluxe' ? '豪華房' : '行政套房'}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">設施</span>
                <span>${data.hasBathtub ? '浴缸' : ''} ${data.hasBreakfast ? '早餐' : ''}</span>
            </div>
    `;
        totalAmount.innerText = details.total;
    } else if (booking.type === 'itinerary') {
        const itinerary = booking.data;
        const details = booking.details || { adults: 2, children: 0, total: itinerary.price, date: '未選擇' };

        orderSummary.innerHTML = `
        <div class="mb-4 border-b border-gray-700 pb-2">
                <h4 class="font-bold text-sm mb-1">${itinerary.title}</h4>
                <p class="text-xs text-gray-400">出發日期: ${details.date}</p>
            </div>
        <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">成人 x ${details.adults}</span>
            <span>$${(parseInt(itinerary.price.replace(/[$,]/g, '')) * details.adults).toLocaleString()}</span>
        </div>
            ${details.children > 0 ? `
            <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">兒童 x ${details.children}</span>
                <span>$${(parseInt(itinerary.price.replace(/[$,]/g, '')) * 0.8 * details.children).toLocaleString()}</span>
            </div>` : ''
            }
    <div class="flex justify-between text-sm mb-4">
        <span class="text-gray-400">折扣碼 (KUROMI2023)</span>
        <span class="text-k-pink">-$1,000</span>
    </div>
    `;

        let finalTotal = parseInt(details.total.replace(/[$,]/g, '')) - 1000;
        if (finalTotal < 0) finalTotal = 0;

        totalAmount.innerText = '$' + finalTotal.toLocaleString();
    }

    // Update cart badge
    updateCartBadge();
}

// Update Cart Badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const bookingData = localStorage.getItem('currentBooking');

    if (badge) { // Check if badge element exists
        if (bookingData) {
            badge.innerText = '1';
            badge.classList.remove('hidden');
        } else {
            badge.innerText = '0';
            badge.classList.add('hidden');
        }
    }
}


// ========== BACK TO TOP BUTTON ==========
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
