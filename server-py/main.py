# from flask import Flask, request, jsonify
# from flask_cors import CORS
#
# app = Flask(__name__)
# CORS(app)  # Дозволяє запити з браузера
#
#
# @app.route('/api/send-quiz', methods=['POST'])
# def handle_quiz():
#     try:
#         data = request.json
#
#         print("\n" + "=" * 40)
#         print("🔔 НОВА ЗАЯВКА VITABUILD")
#         print("=" * 40)
#         print(f"Об'єкт:      {data.get('propertyType')}")
#         print(f"Клас ремонту:{data.get('repairClass')}")
#         print(f"Площа:       {data.get('area')} м²")
#         print(f"Інженерія:   {data.get('engineering')}")
#         print(f"Послуги:     {', '.join(data.get('extras', []))}")
#         print(f"Сума:        ${data.get('estimatedTotal')}")
#         print("=" * 40 + "\n")
#
#         return jsonify({"status": "success", "message": "Data logged"}), 200
#     except Exception as e:
#         print(f"❌ Помилка: {e}")
#         return jsonify({"status": "error", "message": str(e)}), 500
#
#
# if __name__ == '__main__':
#     # Встановлюємо порт 5006, щоб збігалося з JS
#     app.run(host='0.0.0.0', port=5006, debug=True)

#
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
#
# app = Flask(__name__)
# CORS(app)
#
# # --- НАЛАШТУВАННЯ TELEGRAM ---
# BOT_TOKEN = 'AAGWdRZ6AQs1PflVKcsNiBbqyY0rakf-hT4'
# CHAT_ID = '7673800276'
#
#
# def send_to_telegram(message):
#     url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
#     payload = {
#         "chat_id": CHAT_ID,
#         "text": message,
#         "parse_mode": "HTML"  # Дозволяє виділяти текст жирним або курсивом
#     }
#     try:
#         response = requests.post(url, json=payload)
#         return response.ok
#     except Exception as e:
#         print(f"Помилка відправки в Telegram: {e}")
#         return False
#
#
# @app.route('/api/send-quiz', methods=['POST'])
# def handle_quiz():
#     try:
#         data = request.json
#
#         # Формуємо красиве повідомлення для Telegram
#         msg = (
#             f"<b>🚀 НОВА ЗАЯВКА VITABUILD</b>\n"
#             f"━━━━━━━━━━━━━━━━━━\n"
#             f"🏠 <b>Об'єкт:</b> {data.get('propertyType')}\n"
#             f"📏 <b>Площа:</b> {data.get('area')} м²\n"
#             f"💎 <b>Клас:</b> {data.get('repairClass')}\n"
#             f"━━━━━━━━━━━━━━━━━━\n"
#             f"🔧 <b>Інженерія:</b>\n"
#             f"• Електрика: {data.get('engineering', {}).get('electric')} точок\n"
#             f"• Сантехніка: {data.get('engineering', {}).get('plumbing')} вузлів\n"
#             f"• Клімат: {data.get('engineering', {}).get('ac')} конд.\n"
#             f"━━━━━━━━━━━━━━━━━━\n"
#             f"🛠️ <b>Додатково:</b>\n"
#             f"{', '.join(data.get('extras', [])) if data.get('extras') else 'Не обрано'}\n"
#             f"━━━━━━━━━━━━━━━━━━\n"
#             f"💰 <b>СУМА: ${data.get('estimatedTotal')}</b>"
#         )
#
#         # Виводимо в консоль для перевірки
#         print(msg.replace('<b>', '').replace('</b>', ''))
#
#         # Відправляємо в Telegram
#         success = send_to_telegram(msg)
#
#         if success:
#             return jsonify({"status": "success", "message": "Sent to Telegram"}), 200
#         else:
#             return jsonify({"status": "error", "message": "Telegram failed"}), 500
#
#     except Exception as e:
#         print(f"❌ Помилка: {e}")
#         return jsonify({"status": "error", "message": str(e)}), 500
#
#
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5006, debug=True)


import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- НАЛАШТУВАННЯ TELEGRAM ---
BOT_TOKEN = '7673800276:AAGWdRZ6AQs1PflVKcsNiBbqyY0rakf-hT4'
CHAT_ID_MY = '733436205'
CHAT_ID_ADMIN = '615040793'
# 615040793

def send_to_telegram(message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID_MY,
        "text": message,
        "parse_mode": "HTML"
    }
    url1 = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload1 = {
        "chat_id": CHAT_ID_ADMIN,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(url, json=payload, timeout=10)
        response1 = requests.post(url1, json=payload1, timeout=10)
        # Якщо Telegram повернув помилку (наприклад, 400), виведемо її
        if not response.ok:
            print(f"❌ Помилка Telegram API: {response.text}")
            print(f"❌ Помилка Telegram API: {response1.text}")
        return response.ok
    except Exception as e:
        print(f"❌ Критична помилка запиту: {e}")
        return False


@app.route('/api/send-quiz', methods=['POST'])
def handle_quiz():
    try:
        data = request.json
        if not data:
            return jsonify({"status": "error", "message": "No data received"}), 400
        print(data)
        # Збираємо дані обережно, використовуючи .get() з дефолтними значеннями
        user_name = data.get('userName', 'Не вказано')
        user_phone = data.get('userPhone', 'Не вказано')
        prop_type = data.get('propertyType', 'Не вказано')
        area = data.get('area', '0')
        repair_class = data.get('repairClass', 'Не вказано')
        total = data.get('estimatedTotal', '0')

        eng = data.get('engineering', {})
        extras = data.get('extras', [])

        # Формуємо текст
        msg = (
            f"<b>🚀 НОВА ЗАЯВКА VITABUILD</b>\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"<b>👤 НОВИЙ КЛІЄНТ:</b> {user_name}\n"
            f"<b>📞 ТЕЛЕФОН: </b> +380{user_phone}\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"🏠 <b>Об'єкт:</b> {prop_type}\n"
            f"📏 <b>Площа:</b> {area} м²\n"
            f"💎 <b>Клас:</b> {repair_class}\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"🔧 <b>Інженерія:</b>\n"
            f"• Електрика: {eng.get('electric', 0)} точок\n"
            f"• Сантехніка: {eng.get('plumbing', 0)} вузлів\n"
            f"• Клімат: {eng.get('ac', 0)} конд.\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"🛠️ <b>Додатково:</b>\n"
            f"{', '.join(extras) if extras else 'Не обрано'}\n"
            f"━━━━━━━━━━━━━━━━━━\n"
            f"💰 <b>СУМА: ${total}</b>"
        )

        print("🔄 Спроба відправки в Telegram...")
        if send_to_telegram(msg):
            print("✅ Успішно відправлено!")
            return jsonify({"status": "success"}), 200
        else:
            return jsonify({"status": "error", "message": "Failed to send to Telegram"}), 500

    except Exception as e:
        # Це виведе ПОВНУ помилку в консоль Python
        import traceback
        print("‼ СЕРВЕРНА ПОМИЛКА:")
        print(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)