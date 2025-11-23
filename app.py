import json
import os
from flask import Flask, render_template, request

app = Flask(__name__)

def load_data(filename):
    filepath = os.path.join(app.root_path, 'data', filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.after_request
def add_header(response):
    """Add Cache-Control headers to static files."""
    if request.path.startswith('/static'):
        response.cache_control.max_age = 31536000  # 1 year
        response.cache_control.public = True
    return response

@app.route('/')
def home():
    itineraries = load_data('itineraries.json')
    return render_template('index.html', itineraries=itineraries)

@app.route('/about')
def about():
    return render_template('pages/about.html')

@app.route('/news')
def news():
    return render_template('pages/news.html')

@app.route('/careers')
def careers():
    return render_template('pages/careers.html')

@app.route('/faq')
def faq():
    return render_template('pages/faq.html')

@app.route('/contact')
def contact():
    return render_template('pages/contact.html')

@app.route('/privacy')
def privacy():
    return render_template('pages/privacy.html')

# Data for Detail Pages
JOBS = {
    'planner': {
        'title': '暗黑行程規劃師',
        'type': '全職',
        'location': '台北總部',
        'description': '我們正在尋找一位擁有無限想像力，能夠將「叛逆」與「旅行」完美結合的行程規劃師。你不需要遵循傳統的旅遊路線，我們需要的是能夠挖掘城市陰暗面、尋找地下文化、並將其包裝成令人嚮往的獨特體驗的人才。',
        'responsibilities': [
            '開發全球各地的獨特行程（如：廢墟探險、地下音樂祭、哥德式建築巡禮）。',
            '與當地的供應商進行談判，確保行程的獨特性與可行性。',
            '撰寫引人入勝的行程文案，吸引目標客群。',
            '持續關注最新的次文化趨勢，並將其融入產品設計中。'
        ],
        'requirements': [
            '擁有 2 年以上旅遊產品規劃經驗，或對次文化有深入研究者。',
            '具備良好的外語能力（英語必備，第二外語加分）。',
            '熱愛挑戰，不畏懼打破常規。',
            '能夠獨立作業，同時也具備團隊合作精神。'
        ]
    },
    'social': {
        'title': '社群搞怪小編',
        'type': '全職',
        'location': '遠端工作',
        'description': '你是網路迷因的製造機嗎？你懂得如何用一句話激怒（或逗樂）所有人嗎？我們需要一位能夠駕馭 Kuromi Travel 品牌風格的社群小編，用最辛辣、最幽默的文字與粉絲互動。',
        'responsibilities': [
            '管理 Facebook, Instagram, Threads 等社群平台。',
            '發想並執行創意社群行銷活動。',
            '回覆粉絲留言與私訊（保持品牌風格）。',
            '製作簡單的圖文素材與短影音。'
        ],
        'requirements': [
            '重度社群使用者，熟悉各大平台特性。',
            '具備文案撰寫能力，風格幽默犀利。',
            '基本的修圖與剪輯能力。',
            '有一顆強大的心臟，不怕被炎上（誤）。'
        ]
    },
    'sleeper': {
        'title': '首席試睡員',
        'type': '兼職',
        'location': '全球各地',
        'description': '這可能是世界上最棒的工作。你需要入住我們精選的特色旅宿，從古堡到膠囊旅館，並撰寫真實（且挑剔）的體驗報告。我們不接受業配文，我們需要的是最真實的感受。',
        'responsibilities': [
            '入住指定飯店或民宿，體驗其設施與服務。',
            '拍攝高品質的照片與影片。',
            '撰寫詳細的體驗報告，包含優缺點分析。',
            '協助評估該住宿是否符合 Kuromi Travel 的標準。'
        ],
        'requirements': [
            '熱愛旅行，對住宿品質有高標準。',
            '具備良好的攝影與寫作能力。',
            '能夠配合彈性的出差時間。',
            '誠實正直，不畏懼說真話。'
        ]
    }
}

NEWS = {
    'vampire': {
        'title': '全新航線：特蘭西瓦尼亞吸血鬼古堡',
        'date': '2024/05/20',
        'image': 'images/news_vampire_castle.svg',
        'summary': '準備好你的大蒜了嗎？我們即將開啟前往吸血鬼故鄉的神秘航線，入住千年古堡，體驗真正的哥德式浪漫。',
        'content': '<p>羅馬尼亞的特蘭西瓦尼亞（Transylvania），是傳說中吸血鬼德古拉伯爵的故鄉。這裡擁有茂密的森林、險峻的山脈以及無數充滿傳奇色彩的古堡。Kuromi Travel 獨家推出的這條新航線，將帶你直飛這個神秘的國度。</p><p>行程亮點包括參觀布蘭城堡（Bran Castle），這座被認為是德古拉原型的城堡，聳立在岩石之上，氣氛陰森而迷人。我們還安排了入住當地的特色古堡飯店，讓你在夜晚感受中世紀的氛圍（如果不怕遇到吸血鬼的話）。</p><p>此外，我們還將造訪錫吉什瓦拉（Sighisoara），這座保存完好的中世紀城鎮是德古拉伯爵的出生地。漫步在鵝卵石街道上，彷彿穿越時空回到了過去。</p>'
    },
    'halloween': {
        'title': 'Kuromi 生日慶典：全館行程 85 折',
        'date': '2024/10/31',
        'image': 'images/news_halloween_party.svg',
        'summary': '為了慶祝我們最愛的 Kuromi 生日，萬聖節當天預訂任何行程，輸入折扣碼 "HBDKUROMI" 即享 85 折優惠！',
        'content': '<p>10月31日不僅是萬聖節，更是我們最愛的叛逆教主 Kuromi 的生日！為了與全球粉絲一同慶祝這個特別的日子，Kuromi Travel 推出限時 24 小時的快閃優惠。</p><p>只要在 2024/10/31 當天，於官網預訂任何行程（不限出發日期），並在結帳時輸入折扣碼 <strong>"HBDKUROMI"</strong>，即可享有全單 85 折的超值優惠！</p><p>無論你是想去東京體驗龐克文化，還是去倫敦朝聖搖滾聖地，這都是下手的最佳時機。錯過這次，就要再等一年囉！</p>'
    },
    'collab': {
        'title': 'Kuromi x My Melody 世紀大和解？',
        'date': '2024/04/01',
        'image': 'images/news_kuromi_melody_collab.svg',
        'summary': '愚人節限定！我們推出了「粉紅與黑色的碰撞」雙人行程，帶上你最好的朋友（或死對頭）一起出發吧！',
        'content': '<p>這不是愚人節玩笑（雖然發布日期有點可疑）！Kuromi Travel 與 Melody Airways 破天荒攜手合作，推出了名為「世紀大和解」的雙人限定行程。</p><p>這個行程專為風格迥異的旅伴設計。早上，你們將分開行動：Kuromi 派前往地下音樂祭衝撞，Melody 派則去夢幻咖啡廳喝下午茶。晚上，雙方將在一家結合了龐克與甜美風格的主題餐廳會合，分享彼此的一天。</p><p>這是一個考驗友情（或愛情）的終極挑戰。你們能夠包容彼此的差異，共同享受旅行的樂趣嗎？快來報名挑戰吧！</p>'
    }
}

@app.route('/careers/<job_id>')
def job_detail(job_id):
    job = JOBS.get(job_id)
    if not job:
        return render_template('404.html'), 404
    return render_template('pages/job_detail.html', job=job)

@app.route('/news/<news_id>')
def news_detail(news_id):
    news_item = NEWS.get(news_id)
    if not news_item:
        return render_template('404.html'), 404
    return render_template('pages/news_detail.html', news=news_item)

@app.route('/flights')
def flights():
    return render_template('pages/flights.html')

@app.route('/hotels')
def hotels():
    return render_template('pages/hotels.html')

@app.route('/sitemap.xml')
def sitemap():
    """Generate sitemap.xml dynamically."""
    pages = []
    # Static pages
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and len(rule.arguments) == 0:
            pages.append(
                [rule.rule, "2024-11-23"]
            )  # In a real app, use actual last modified dates

    sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"""
    for page in pages:
        sitemap_xml += f"""  <url>
    <loc>http://localhost:5003{page[0]}</loc>
    <lastmod>{page[1]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
    sitemap_xml += "</urlset>"
    return (sitemap_xml, 200, {'Content-Type': 'application/xml'})

@app.route('/robots.txt')
def robots():
    """Generate robots.txt."""
    robots_txt = """User-agent: *
Disallow:

Sitemap: http://localhost:5003/sitemap.xml
"""
    return (robots_txt, 200, {'Content-Type': 'text/plain'})

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, port=5003)
