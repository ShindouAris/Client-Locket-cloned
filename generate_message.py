import random
import uuid
from datetime import datetime, timedelta
import json

donor_names = [
    "星乃一歌", "天馬咲希", "望月穂波", "日野森志歩",
    "花里みのり", "桐谷遥", "桃井愛莉", "日野森雫",
    "宵崎奏", "朝比奈まふゆ", "東雲絵名", "暁山瑞希",
    "小豆沢こはね", "白石杏", "東雲彰人", "青柳冬弥",
    "天馬司", "鳳えむ", "草薙寧々", "神代類",
    "初音ミク", "鏡音リン", "鏡音レン", "巡音ルカ", "MEIKO", "KAITO"
]

jp_messages = [
    "応援しています！",
    "頑張ってください！",
    "素晴らしい活動ですね！",
    "これからも楽しみにしています！",
    "ちょっとだけど…応援！",
    "イケメンだから仕方ない！",
    "感動しました！",
    "無理しないでくださいね！",
    "これでラーメンでも食べてね！",
    "いいね！"
]

def random_date_june_2025():
    base = datetime(2025, 6, 1)
    delta_days = random.randint(0, 29)
    random_time = timedelta(
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59)
    )
    dt = base + timedelta(days=delta_days) + random_time
    return dt

donations = []

for _ in range(20):
    dt = random_date_june_2025()
    message = f"{random.choice(jp_messages)}"
    donations.append({
        "id": str(uuid.uuid4()),
        "donorname": random.choice(donor_names),
        "amount": random.randint(100_000, 1_000_000_000),
        "date": dt.strftime('%Y-%m-%dT%H:%M:%S'),
        "message": message,
        "created_at": dt.isoformat() + "+00:00"
    })

with open('donations.json', 'w', encoding='utf-8') as f:
    json.dump(donations, f, ensure_ascii=False, indent=4)
