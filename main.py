from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
)
data = [
    {
        "id": 3,
        "uid": "eA1Z4is7BVWn1M45SAelHeloBfh2",
        "options": {
            "type": "background",
            "caption": "Light green",
            "color_top": "#ffffff",
            "color_text": "#008628",
            "color_bottom": "#b1fff9"
        },
        "user_info": {
            "plan": "Pro",
            "username": "zv.fnim@gmail.com",
            "displayName": "DN Khoa 💻🔒",
            "profilePicture": "https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/users%2FeA1Z4is7BVWn1M45SAelHeloBfh2%2Fpublic%2Fprofile_pic.webp?alt=media&token=4975a411-7f6f-43a2-8697-023eb8c9141d"
        },
        "stats": {
            "hearts": 0,
            "shares": 0,
            "comments": 0,
            "downloads": 0
        },
        "created_at": "2025-05-30T15:02:37.727788+00:00"
    },
    {
        "id": 2,
        "uid": "eA1Z4is7BVWn1M45SAelHeloBfh2",
        "options": {
            "type": "background",
            "caption": "Light green",
            "color_top": "#ffffff",
            "color_text": "#00cc5e",
            "color_bottom": "#dafff7"
        },
        "user_info": {
            "plan": "Pro",
            "username": "zv.fnim@gmail.com",
            "displayName": "DN Khoa 💻🔒",
            "profilePicture": "https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/users%2FeA1Z4is7BVWn1M45SAelHeloBfh2%2Fpublic%2Fprofile_pic.webp?alt=media&token=4975a411-7f6f-43a2-8697-023eb8c9141d"
        },
        "stats": {
            "hearts": 0,
            "shares": 0,
            "comments": 0,
            "downloads": 0
        },
        "created_at": "2025-05-30T14:59:16.822992+00:00"
    },
    {
        "id": 6,
        "uid": "RCQ94Icmh7fvFr5ycLaHJgyQo8j1",
        "options": {
            "type": "background",
            "caption": "",
            "color_top": "#450d59",
            "color_text": "#FFFFFF",
            "color_bottom": "#11053b"
        },
        "user_info": {
            "plan": "Premium",
            "username": "diodio",
            "displayName": "Dio 🎧",
            "profilePicture": "https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/users%2FRCQ94Icmh7fvFr5ycLaHJgyQo8j1%2Fpublic%2Fprofile_pic.webp?alt=media&token=9a3036c7-1341-4317-9d72-d656fccbf060"
        },
        "stats": {
            "hearts": 0,
            "shares": 0,
            "comments": 0,
            "downloads": 0
        },
        "created_at": "2025-05-30T14:40:59.557238+00:00"
    },
    {
        "id": 5,
        "uid": "7RYPO0BkifWm6AzGDkV8N1SRkWw1",
        "options": {
            "type": "background",
            "caption": "",
            "color_top": "#FF9500",
            "color_text": "#FFFFFF",
            "color_bottom": "#FF2D95"
        },
        "user_info": {
            "plan": "Premium",
            "username": "cxder",
            "displayName": "Bé iu",
            "profilePicture": "https://firebasestorage.googleapis.com:443/v0/b/locket-img/o/users%2F7RYPO0BkifWm6AzGDkV8N1SRkWw1%2Fpublic%2Fprofile_pic.webp?alt=media&token=aab5c7a7-01e9-4e3b-a036-ecbeedbf9e8b"
        },
        "stats": {
            "hearts": 0,
            "shares": 0,
            "comments": 0,
            "downloads": 0
        },
        "created_at": "2025-05-28T14:15:02.732182+00:00"
    },
    {
        "id": 1,
        "uid": "RCQ94Icmh7fvFr5ycLaHJgyQo8j1",
        "options": {
            "type": "background",
            "caption": "",
            "color_top": "#8B5DFF",
            "color_text": "#FFF7D1",
            "color_bottom": "#6A42C2"
        },
        "user_info": {
            "plan": "Premium",
            "username": "kanade",
            "displayName": "Kanade 🎧",
            "profilePicture": "https://raw.githubusercontent.com/ShindouAris/Client-Locket-cloned/refs/heads/main/public/locket-icon.png"
        },
        "stats": {
            "hearts": 727,
            "shares": 123,
            "comments": 0,
            "downloads": 1924
        },
        "created_at": "2025-06-04T14:40:59.557238+00:00"
    },
    
]

themes = [
    {
        "id": "12ea0287-9e4d-4f56-bb18-fa4775fee756",
        "preset_id": "mixue_times",
        "type": "custome",
        "icon": "🍦",
        "preset_caption": "Mixue Time!",
        "color_top": "#E0F7FA",
        "color_bottom": "#FFCDD2",
        "text_color": "#4E0000E6",
        "created_at": "2025-04-21T14:51:18.932269",
        "order_index": 2
    },
    {
        "id": "03c140ab-bab5-4de9-a81e-1b1fc0bdeb55",
        "preset_id": "locket_times",
        "type": "custome",
        "icon": "📸",
        "preset_caption": "Locket Time!",
        "color_top": "#FFDEE9",
        "color_bottom": "#B5FFFC",
        "text_color": "#202020E6",
        "created_at": "2025-05-22T00:06:44.562356",
        "order_index": 3
    },
    {
        "id": "d8da250a-1843-4ead-af8e-cfded7bf028e",
        "preset_id": "earth_day_2025",
        "type": "decorative",
        "icon": "🌎",
        "preset_caption": "Earth Day",
        "color_top": "#53C2FF",
        "color_bottom": "#033C9A",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T12:26:56.368017",
        "order_index": 7
    },
    {
        "id": "3efa1a4f-abd9-4fc0-830e-238395d88abd",
        "preset_id": "valentines_day",
        "type": "decorative",
        "icon": "💌",
        "preset_caption": "Happy Valentine's Day!",
        "color_top": "#FBDAE6",
        "color_bottom": "#EB95B5",
        "text_color": "#D21514",
        "created_at": "2025-04-23T13:48:48.120087",
        "order_index": 8
    },
    {
        "id": "0c2e7e4f-af6a-4b63-b48f-2fe2c92e1992",
        "preset_id": "mothers_day_2025",
        "type": "decorative",
        "icon": "💐",
        "preset_caption": "Mother’s Day",
        "color_top": "#F6D6D3",
        "color_bottom": "#DA9E99",
        "text_color": "#C51749",
        "created_at": "2025-05-11T17:18:43.777433",
        "order_index": 9
    },
    {
        "id": "22b28b19-750e-4a44-ac71-923d6b60c550",
        "preset_id": "icon_pastel_3d_blue",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747855391/pastel_3d_blue_dy0k9f.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "#4DA6FF",
        "created_at": "2025-05-21T19:27:21.326831",
        "order_index": 3
    },
    {
        "id": "60ff3d90-04ea-4ddd-a3dc-07fce2459c94",
        "preset_id": "easter_2025",
        "type": "decorative",
        "icon": "🐣",
        "preset_caption": "Happy Easter!",
        "color_top": "#FFFD89",
        "color_bottom": "#FFDA58",
        "text_color": "#E24B6C",
        "created_at": "2025-04-21T11:38:43.735737",
        "order_index": 6
    },
    {
        "id": "e5a8289f-ff40-4f71-be7e-88a2632b6368",
        "preset_id": "ootd",
        "type": "decorative",
        "icon": "🕶",
        "preset_caption": "OOTD",
        "color_top": "#FFFFFF",
        "color_bottom": "#DBDBDB",
        "text_color": "#101010E6",
        "created_at": "2025-04-21T13:24:11.9646",
        "order_index": 5
    },
    {
        "id": "a1bc63b9-eb26-48a2-a021-7830769225e8",
        "preset_id": "miss_you",
        "type": "decorative",
        "icon": "🥰",
        "preset_caption": "Miss you",
        "color_top": "#EC0C00",
        "color_bottom": "#FF493F",
        "text_color": "#FFFFFFDB",
        "created_at": "2025-04-21T13:24:26.179785",
        "order_index": 4
    },
    {
        "id": "c7962fff-99c8-4084-a291-c525fda1e3b2",
        "preset_id": "goodnight",
        "type": "decorative",
        "icon": "🌙",
        "preset_caption": "Goodnight",
        "color_top": "#370C6F",
        "color_bottom": "#575CD4",
        "text_color": "#FFFFFFE6",
        "created_at": "2025-04-21T13:22:19.335374",
        "order_index": 3
    },
    {
        "id": "c2cdf59e-d084-49e2-9fd9-c38593ef0fd8",
        "preset_id": "good_morning",
        "type": "decorative",
        "icon": "☀️",
        "preset_caption": "Good Morning",
        "color_top": "#EF7402",
        "color_bottom": "#EABF0F",
        "text_color": "#FFFFFFE5",
        "created_at": "2025-04-21T13:21:48.306304",
        "order_index": 2
    },
    {
        "id": "6263ba41-921c-4cd4-969f-1e236df0bc69",
        "preset_id": "pastel_3d_pink",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747855391/pastel_3d_pink_r1mr6i.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "#F8C5D6",
        "created_at": "2025-05-21T19:31:56.668496",
        "order_index": 4
    },
    {
        "id": "b8279217-2b9a-490f-a9db-54bc6768dfbf",
        "preset_id": "party_time",
        "type": "decorative",
        "icon": "🪩",
        "preset_caption": "Party Time!",
        "color_top": "#5EFFF5",
        "color_bottom": "#FCFF57",
        "text_color": "#000000E6",
        "created_at": "2025-04-21T13:23:59.232486",
        "order_index": 1
    },
    {
        "id": "98df5773-5c97-4007-a384-00b6bac36c86",
        "preset_id": "gold_on_black_outline",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747855391/gold_on_black_outline_oe4ywo.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "#FFD700",
        "created_at": "2025-05-21T19:33:41.258001",
        "order_index": 5
    },
    {
        "id": "bc556c5d-b191-4121-8007-756bd5a0b438",
        "preset_id": "reunification_day_2025",
        "type": "decorative",
        "icon": "🇻🇳",
        "preset_caption": "Chào mừng 30/4",
        "color_top": "#910000",
        "color_bottom": "#7B0909",
        "text_color": "#F6D669",
        "created_at": "2025-04-29T15:38:21.027735",
        "order_index": 0
    },
    {
        "id": "4f4ad10e-b057-4715-89d1-a3f47930d3ec",
        "preset_id": "gem_bg_pink",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747856281/gem_bg_pink_djxvzw.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "#6A0DAD",
        "created_at": "2025-05-21T19:39:51.913635",
        "order_index": 6
    },
    {
        "id": "288c1045-c278-49eb-8810-01946bada01b",
        "preset_id": "happy_birthday",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747390365/birthday_indicator_Normal_3x_aifrzs.png",
        "preset_caption": "Happy Birthday!",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-23T01:11:00.908314",
        "order_index": 7
    },
    {
        "id": "247fa9fa-5f20-4b47-b427-d2d599c6b50c",
        "preset_id": "dating_times",
        "type": "custome",
        "icon": "💕",
        "preset_caption": "Dating Time!",
        "color_top": "#FF9A9E",
        "color_bottom": "#F6416C",
        "text_color": "#FFFFFFE6",
        "created_at": "2025-05-23T15:41:18.030907",
        "order_index": 5
    },
    {
        "id": "29cae1fd-a83b-411f-8b42-d76b4a587bc9",
        "preset_id": "locket_normal",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1748361824/locket_gold_logo_3x_yy9cuw.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-27T16:06:36.842631",
        "order_index": 0
    },
    {
        "id": "371feb69-617f-4255-91af-cf7cc3d60c60",
        "preset_id": "neon",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#FF00FF",
        "color_bottom": "#00FFFF",
        "text_color": "#000000",
        "created_at": "2025-05-11T17:30:51.69784",
        "order_index": 0
    },
    {
        "id": "5b7177cb-b3c1-4429-aeb6-ca6562464984",
        "preset_id": "galaxy",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#5733FF",
        "color_bottom": "#FF33B5",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T11:17:41.724692",
        "order_index": 1
    },
    {
        "id": "5326e4da-f7b6-488a-9f69-f8d5447fac2f",
        "preset_id": "peachy",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#FF9500",
        "color_bottom": "#FF2D95",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T11:18:29.777823",
        "order_index": 2
    },
    {
        "id": "e19e8fe3-268b-49bc-9f59-ee4bf4119ab5",
        "preset_id": "sunset",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#FF5733",
        "color_bottom": "#FFC300",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T11:18:01.006713",
        "order_index": 3
    },
    {
        "id": "36edc714-3dcd-4e37-a1f6-c5d7414e0e00",
        "preset_id": "aqua_fresh",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#33FF57",
        "color_bottom": "#33CFFF",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T11:18:15.451745",
        "order_index": 4
    },
    {
        "id": "3e71231a-c530-428b-ae0b-b3403813cfc6",
        "preset_id": "cotton_candy",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#00B5FF",
        "color_bottom": "#FFB6C1",
        "text_color": "#FFFFFF",
        "created_at": "2025-04-22T11:18:42.900931",
        "order_index": 5
    },
    {
        "id": "9e8c227b-8c94-41a6-95ea-ce61a55eae94",
        "preset_id": "pastel",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#FAD0C4",
        "color_bottom": "#FFD1FF",
        "text_color": "#333333",
        "created_at": "2025-05-11T17:32:19.632095",
        "order_index": 4
    },
    {
        "id": "0602632d-0a91-4791-abea-220299f35c38",
        "preset_id": "bubblegum",
        "type": "background",
        "icon": "",
        "preset_caption": "",
        "color_top": "#FF85B3",
        "color_bottom": "#FFDDC1",
        "text_color": "#333333",
        "created_at": "2025-05-11T17:33:44.536988",
        "order_index": 5
    },
    {
        "id": "f42f1c66-2153-4d12-8e52-740fed13adb8",
        "preset_id": "light_hearts",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1748363647/light_hearts_yxpqa3.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-27T16:36:16.953949",
        "order_index": 0
    },
    {
        "id": "088c7116-48c9-47e6-96fb-a6c78382b9cf",
        "preset_id": "flowers_magenta",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1748363647/flowers_magenta_eplyqj.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-27T16:37:15.32668",
        "order_index": 0
    },
    {
        "id": "39a72dc1-bbf8-42f1-b606-a3cb7e88fb00",
        "preset_id": "coffee_time",
        "type": "custome",
        "icon": "☕",
        "preset_caption": "Coffee Time!",
        "color_top": "#B48E72",
        "color_bottom": "#4B2C20",
        "text_color": "#FFFFFFE6",
        "created_at": "2025-05-22T00:03:12.507739",
        "order_index": 0
    },
    {
        "id": "750eff42-5a31-4130-8616-33f6c6e4c372",
        "preset_id": "feeling_cute",
        "type": "custome",
        "icon": "🌷",
        "preset_caption": "Feeling Cute",
        "color_top": "#FFB199",
        "color_bottom": "#FF6A88",
        "text_color": "#FFFFFFE6",
        "created_at": "2025-05-22T00:05:11.105642",
        "order_index": 0
    },
    {
        "id": "96619cb2-46db-416b-87cd-35ccfd741055",
        "preset_id": "snake_vibes",
        "type": "custome",
        "icon": "🐍",
        "preset_caption": "Snake Vibes",
        "color_top": "#8bff4d",
        "color_bottom": "#055200",
        "text_color": "#ffffff",
        "created_at": "2025-05-22T00:01:25.425408",
        "order_index": 1
    },
    {
        "id": "919be5be-e570-450e-9439-e2cebe2397fa",
        "preset_id": "locket_gold_badge",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747390369/locket_gold_badge_small_Normal_3x_znsfh3.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-16T14:27:16.83878",
        "order_index": 0
    },
    {
        "id": "7a4b06d6-6355-4070-a779-3b73fadbf188",
        "preset_id": "celebrity_badge",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747390374/celebrity_badge_small_Normal_3x_vjmfwg.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "",
        "created_at": "2025-05-16T10:27:45.408867",
        "order_index": 1
    },
    {
        "id": "82895ae6-c1e4-4501-8ab3-57756d19aedc",
        "preset_id": "icon_locket_default",
        "type": "image_icon",
        "icon": "https://res.cloudinary.com/diocloud/image/upload/v1747406421/icon_locket_default_shiga3.png",
        "preset_caption": "",
        "color_top": "",
        "color_bottom": "",
        "text_color": "#F6D669",
        "created_at": "2025-05-16T14:43:27.596751",
        "order_index": 2
    }
]

timelines = [
    {
        "id": 30,
        "date": "2025-06-04",
        "title": "Kanade đã crack Locket Dio",
        "description": "Kanade đã crack Locket Dio, Limit la cai deo j"
    },
    {
        "id": 29,
        "date": "2025-05-28",
        "title": "Cập nhật và áp dụng quyền lợi thành viên",
        "description": "Nhằm duy trì hoạt động ổn định của website và mang lại trải nghiệm tốt hơn cho người dùng, mình đã triển khai hệ thống quyền lợi dành riêng cho các thành viên. Những quyền lợi này sẽ giúp bạn có thêm tính năng nâng cao, ưu tiên truy cập và nhiều tiện ích thú vị khác. Cảm ơn bạn đã đồng hành và ủng hộ mình!"
    },
    {
        "id": 28,
        "date": "2025-05-27",
        "title": "Cập nhật tính năng mới “Chọn bạn bè có thể xem”",
        "description": "Nhận thấy điều này rất quan trọng nên tôi đã nghiên cứu, tìm hiểu sau cùng là tích hợp vào để sử dụng dễ dàng. Enjoy"
    },
    {
        "id": 27,
        "date": "2025-05-26",
        "title": "Tính năng mới lưu phiên đăng nhập",
        "description": "Nhận thấy trải nghiệm bị giảm xuống khi mà phải đăng nhập lại nhiều lần và bị lỗi khi đăng bài do hết phiên đăng nhập nên tôi đã tích hợp tính năng này vào."
    },
    {
        "id": 26,
        "date": "2025-05-25",
        "title": "Thêm mới tính năng bạn bè",
        "description": "Nâng cấp hệ thống server với API mới cho phép lấy và lọc danh sách bạn bè một cách linh hoạt và nhanh chóng, giúp người dùng dễ dàng quản lý và tìm kiếm bạn bè trên website."
    },
    {
        "id": 25,
        "date": "2025-05-22",
        "title": "Đưa tính năng forms caption hoạt động trở lại",
        "description": "Vì một số lý do bất khả kháng, để nguyên thì chạy ngon, nhưng chỉ cần sửa một tí là lỗi bung như pháo. Sau một hồi cày cuốc, mình đã debug và tối ưu lại tính năng này – giờ thì mượt mà cực kỳ, cảm giác thật \"enjoy cái moment này\". Tralalero Tralala!"
    },
    {
        "id": 24,
        "date": "2025-05-21",
        "title": "Cập nhật thêm Caption",
        "description": "Tung tung tung Sahur. Có thêm danh sách caption icon mới hãy vào tab Custome Studio để xem và trải nghiệm nhé."
    },
    {
        "id": 23,
        "date": "2025-05-16",
        "title": "Nâng cấp server lên V1.0.0",
        "description": "Để nâng cao chất lượng dự án, tôi quyết định tối ưu hóa hiệu suất xử lý và cải tiến logic, giúp hệ thống dễ dàng mở rộng, bảo trì và khắc phục lỗi trong tương lai.\n- Phiên bản API V0.3.1 => V1.0.0"
    },
    {
        "id": 22,
        "date": "2025-05-11",
        "title": "💐 Mother’s Day đã có mặt",
        "description": "Chúc mừng những người mẹ tuyệt vời – những người luôn yêu thương, che chở và đồng hành cùng chúng ta. Hãy dành thời gian để nói lời yêu thương và biết ơn hôm nay. ❤️"
    },
    {
        "id": 21,
        "date": "2025-05-07",
        "title": "Chỉnh sửa và nâng cấp giao diện LocketUI",
        "description": "Cải tiến logic để cho phép gửi nhiều bài viết đồng thời, giúp tối ưu hóa quy trình tải lên mà không cần phải chờ đợi từng bài hoàn thành trước khi bắt đầu bài tiếp theo.\nNâng cấp giao diện cho dễ dùng và mượt mà hơn.\n"
    },
    {
        "id": 20,
        "date": "2025-04-29",
        "title": "🇻🇳 Chào mừng 30/4!",
        "description": "Hòa cùng không khí lịch sử 30/4, hãy gửi lời chúc ý nghĩa và lan tỏa niềm tự hào dân tộc qua những tấm hình rực rỡ."
    },
    {
        "id": 19,
        "date": "2025-04-22",
        "title": "🌎 Earth Day đã có mặt!",
        "description": "Hãy cùng nhau bảo vệ hành tinh xanh bằng cách lan tỏa thông điệp yêu thiên nhiên qua các khoảnh khắc đầy cảm hứng."
    },
    {
        "id": 18,
        "date": "2025-04-20",
        "title": "🐣 Happy Easter đã có mặt!",
        "description": "Cùng lan tỏa không khí Phục Sinh với theme rực rỡ và lời chúc an lành đến mọi người."
    },
    {
        "id": 3,
        "date": "2025-04-03",
        "title": "Xây dựng hệ thống backend",
        "description": "Nghiên cứu cách thức hoạt động và phát triển API.\nCấu trúc code theo mô hình MVC để dễ dàng bảo trì và mở rộng."
    },
    {
        "id": 17,
        "date": "2025-03-19",
        "title": "Sửa lỗi giao diện caption trên LocketUI",
        "description": "Lỗi là phải sửa, thật khó chịu khi caption ngắn mà bị xuống dòng."
    },
    {
        "id": 16,
        "date": "2025-03-18",
        "title": "Thêm tính năng gửi email góp ý",
        "description": "Bạn muốn góp ý? Tới ngay giao diện bên phải của Locket UI."
    },
    {
        "id": 15,
        "date": "2025-03-18",
        "title": "Tích hợp thêm chụp ảnh/quay video trực tiếp",
        "description": "Giờ đây quay video hay chụp ảnh nhanh hơn rồi sử dụng giống như app Locket thực thụ."
    },
    {
        "id": 14,
        "date": "2025-03-16",
        "title": "Cập nhật tính năng theo dõi trạng thái Server",
        "description": "Ra mắt tính năng mới giúp người dùng dễ dàng theo dõi và kiểm tra trạng thái hoạt động của Server, nâng cao khả năng quản lý và tối ưu hiệu suất hệ thống.\n\n"
    },
    {
        "id": 13,
        "date": "2025-03-16",
        "title": "Cải thiện và tối ưu giao diện",
        "description": "Cập nhật và tối ưu giao diện để mang lại trải nghiệm người dùng tốt hơn, giúp nền tảng trở nên dễ sử dụng và mượt mà hơn."
    },
    {
        "id": 12,
        "date": "2025-03-15",
        "title": "Bổ sung trang About & Docs",
        "description": "Bổ sung thêm trang giới thiệu về Dio và trang tài liệu (Docs) để người dùng dễ dàng tìm hiểu và sử dụng nền tảng.\n\n"
    },
    {
        "id": 11,
        "date": "2025-03-13",
        "title": "Nâng cấp Server & API V2.0",
        "description": "Hệ thống đã hỗ trợ đăng ảnh, video kèm chú thích có màu sắc tùy chỉnh. Đồng thời tối ưu dung lượng để hạn chế lỗi trong quá trình gửi yêu cầu."
    },
    {
        "id": 10,
        "date": "2025-03-12",
        "title": "Xây dựng giao diện ứng dụng Locket",
        "description": "Xây dựng giao diện Locket để tối ưu trải nghiệm giống như trên app, thao tác dễ dàng hơn.\n\n"
    },
    {
        "id": 9,
        "date": "2025-03-09",
        "title": "Triển khai website lên Firebase Hosting",
        "description": "Hoàn tất việc triển khai website lên Firebase Hosting! Giờ đây, trang web có thể hoạt động trực tuyến một cách nhanh chóng và ổn định, sẵn sàng để mọi người truy cập."
    },
    {
        "id": 8,
        "date": "2025-03-08",
        "title": "Ra mắt tính năng Theme Caption",
        "description": "Giờ đây, bạn có thể tùy chỉnh giao diện theo phong cách riêng! Hệ thống theme mới giúp trang web trở nên sống động và cá nhân hóa hơn bao giờ hết."
    },
    {
        "id": 7,
        "date": "2025-03-07",
        "title": "Thêm API GetLastestMoment",
        "description": "Phát triển và triển khai API GetLastestMoment để lấy bài viết mới nhất từ bạn bè trên Locket"
    },
    {
        "id": 5,
        "date": "2025-03-06",
        "title": "Deploy API lên máy chủ",
        "description": "Hoàn tất việc deploy API lên server production, đảm bảo hệ thống hoạt động ổn định và bảo mật.\n\n✅ Các API đã sẵn sàng:\n- `/login` - Xác thực người dùng\n- `/auth` - Kiểm tra phiên đăng nhập\n- `/logout` - Đăng xuất an toàn\n- `/getinfo` - Lấy thông tin chi tiết Locket\n- `/post` - Tải phương tiện lên Locket"
    },
    {
        "id": 6,
        "date": "2025-03-06",
        "title": "Thêm trang Timeline",
        "description": "Triển khai và kiểm thử trang Timeline để hiển thị lịch sử cập nhật."
    },
    {
        "id": 4,
        "date": "2025-03-05",
        "title": "Test API & kiểm tra lỗi",
        "description": "Chạy thử nghiệm các API trên môi trường staging để kiểm tra tính ổn định, hiệu suất và bảo mật.\nTiến hành debug và tối ưu hóa phản hồi API."
    },
    {
        "id": 2,
        "date": "2025-03-03",
        "title": "Thiết kế giao diện người dùng",
        "description": "Thiết kế và tối ưu UI/UX với phong cách hiện đại, đảm bảo responsive trên mọi thiết bị.\n✅ Tích hợp chế độ sáng/tối để nâng cao trải nghiệm.\n📌 Các trang được thiết kế:\n- 🏠 Home\n- 🔑 Login\n- 👤 Profile\n- 📝 Post"
    },
    {
        "id": 1,
        "date": "2025-03-02",
        "title": "Bắt đầu dự án Locket Dio",
        "description": "Chính thức bắt đầu hành trình phát triển Locket Dio! 🚀\n✅ Thiết lập repository trên Git.\n✅ Lên kế hoạch phát triển và phân chia công việc.\n✅ Công nghệ sử dụng: Vite ⚡ + React ⚛️."
    }
]

donations = [
    {
        "id": "7ae05d05-6f28-4e05-8fbd-df371e7f8a02",
        "donorname": "天馬咲希",
        "amount": 161262711,
        "date": "2025-06-07T13:02:11",
        "message": "素晴らしい活動ですね！",
        "created_at": "2025-06-07T13:02:11+00:00"
    },
    {
        "id": "169d198d-d626-4140-9e0a-81d1d9769d74",
        "donorname": "鏡音レン",
        "amount": 356451805,
        "date": "2025-06-16T07:38:01",
        "message": "いいね！",
        "created_at": "2025-06-16T07:38:01+00:00"
    },
    {
        "id": "a297efec-fd7b-45d6-b394-f60bf16149d1",
        "donorname": "望月穂波",
        "amount": 875700448,
        "date": "2025-06-24T13:52:29",
        "message": "応援しています！",
        "created_at": "2025-06-24T13:52:29+00:00"
    },
    {
        "id": "ec46bd1d-c5c6-4c92-a64c-d962205abbb2",
        "donorname": "日野森雫",
        "amount": 462612015,
        "date": "2025-06-24T17:07:34",
        "message": "イケメンだから仕方ない！",
        "created_at": "2025-06-24T17:07:34+00:00"
    },
    {
        "id": "5035ae43-c949-43d7-a178-92bc64f0ff19",
        "donorname": "花里みのり",
        "amount": 817546108,
        "date": "2025-06-03T21:17:56",
        "message": "いいね！",
        "created_at": "2025-06-03T21:17:56+00:00"
    },
    {
        "id": "804c9eda-59df-45f0-85a3-882e62f7028b",
        "donorname": "日野森雫",
        "amount": 22988892,
        "date": "2025-06-04T21:28:06",
        "message": "頑張ってください！",
        "created_at": "2025-06-04T21:28:06+00:00"
    },
    {
        "id": "b2b1b8e4-0c06-42df-92dc-a8180cbfe8cf",
        "donorname": "東雲絵名",
        "amount": 829473447,
        "date": "2025-06-27T12:17:57",
        "message": "無理しないでくださいね！",
        "created_at": "2025-06-27T12:17:57+00:00"
    },
    {
        "id": "eaba260f-f05d-4bf3-8dcc-ef20b4763540",
        "donorname": "鏡音リン",
        "amount": 910837350,
        "date": "2025-06-22T01:04:58",
        "message": "素晴らしい活動ですね！",
        "created_at": "2025-06-22T01:04:58+00:00"
    },
    {
        "id": "8deeec52-9eb3-498f-9159-71570f911b7f",
        "donorname": "天馬咲希",
        "amount": 530624026,
        "date": "2025-06-06T06:41:58",
        "message": "これでラーメンでも食べてね！",
        "created_at": "2025-06-06T06:41:58+00:00"
    },
    {
        "id": "ed5a3a09-5261-47be-a5a2-ee8a7673a06f",
        "donorname": "MEIKO",
        "amount": 891709194,
        "date": "2025-06-22T23:14:50",
        "message": "ちょっとだけど…応援！",
        "created_at": "2025-06-22T23:14:50+00:00"
    },
    {
        "id": "84809919-91e3-46d1-81a0-372581561654",
        "donorname": "望月穂波",
        "amount": 614494105,
        "date": "2025-06-26T08:20:37",
        "message": "これからも楽しみにしています！",
        "created_at": "2025-06-26T08:20:37+00:00"
    },
    {
        "id": "18af30a6-9359-450f-8189-ab08aed3c68f",
        "donorname": "草薙寧々",
        "amount": 771825060,
        "date": "2025-06-18T22:51:25",
        "message": "いいね！",
        "created_at": "2025-06-18T22:51:25+00:00"
    },
    {
        "id": "b28797f5-8855-4817-88e3-f6809140c8c0",
        "donorname": "巡音ルカ",
        "amount": 270277725,
        "date": "2025-06-10T06:11:01",
        "message": "応援しています！",
        "created_at": "2025-06-10T06:11:01+00:00"
    },
    {
        "id": "d789b1a8-1818-42fc-8072-ad1a37878ded",
        "donorname": "東雲彰人",
        "amount": 176683414,
        "date": "2025-06-10T15:43:43",
        "message": "頑張ってください！",
        "created_at": "2025-06-10T15:43:43+00:00"
    },
    {
        "id": "5793174d-5d28-4910-ab57-a76633f68ac6",
        "donorname": "朝比奈まふゆ",
        "amount": 248972977,
        "date": "2025-06-05T22:29:04",
        "message": "感動しました！",
        "created_at": "2025-06-05T22:29:04+00:00"
    },
    {
        "id": "714a19a6-cf60-4328-a1dd-4f2f5192d534",
        "donorname": "朝比奈まふゆ",
        "amount": 25284973,
        "date": "2025-06-23T23:14:49",
        "message": "頑張ってください！",
        "created_at": "2025-06-23T23:14:49+00:00"
    },
    {
        "id": "54ed624f-a1a7-48c6-a5e6-352a9162f46a",
        "donorname": "草薙寧々",
        "amount": 452189571,
        "date": "2025-06-03T21:24:51",
        "message": "イケメンだから仕方ない！",
        "created_at": "2025-06-03T21:24:51+00:00"
    },
    {
        "id": "c00c2487-f450-45f9-80e0-eea3022196d4",
        "donorname": "朝比奈まふゆ",
        "amount": 471674881,
        "date": "2025-06-03T01:03:13",
        "message": "ちょっとだけど…応援！",
        "created_at": "2025-06-03T01:03:13+00:00"
    },
    {
        "id": "8deff3dd-603a-4879-82e2-f6dfbd9cb9c3",
        "donorname": "鏡音リン",
        "amount": 59275653,
        "date": "2025-06-18T01:58:58",
        "message": "感動しました！",
        "created_at": "2025-06-18T01:58:58+00:00"
    },
    {
        "id": "35f474d1-a0f0-4861-bd86-7b23ce248136",
        "donorname": "朝比奈まふゆ",
        "amount": 40719866,
        "date": "2025-06-14T08:40:57",
        "message": "ちょっとだけど…応援！",
        "created_at": "2025-06-14T08:40:57+00:00"
    }
]

@app.get("/locketpro/user-themes/caption-posts")
async def get_caption_posts():
    return JSONResponse(content=data)

@app.get("/locketpro/themes")
async def get_themes():
    return JSONResponse(content=themes)

@app.get("/locketpro/timelines")
async def get_timelines():
    return JSONResponse(content=timelines)

@app.get("/locketpro/donations")
async def get_donations():
    return JSONResponse(content=donations)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5004)