import requests
import os
import base64

from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)
app.url_map.strict_slashes = False
carterapi_baseurl = "http://127.0.0.1:5001/"


@app.route("/")
def index():
    # Data to send in the request body
    request_data = {
    }

    headers = {
        'x-api-key': "abc",
        'Content-Type': 'application/json'
    }

    response = requests.post(f"{carterapi_baseurl}/get/portfolio-config", headers=headers, json=request_data)
    data = response.json()["data"]

    favicon_data = base64.b64decode(data["favicon"])

    with open("static/assets/icons/favicon.ico", 'wb') as ico_file:
        ico_file.write(favicon_data)

    segments = {}

    for segment_id in data["segments"]:
        request_data = {
            "id": segment_id
        }
        response = requests.post(f"{carterapi_baseurl}/get/portfolio-segment", headers=headers, json=request_data)
        segment_data = response.json()["data"]
        segment_name = segment_data["name"]
        segment_data.pop("name")
        segments.update({segment_name: segment_data})

    show_icons = True
    show_banners = True

    mode = request.args.get("mode")
    if not mode:
        mode = "dark"

    if mode == "dark":
        notmode = "light"
    else:
        notmode = "dark"

    return render_template(
        "index.html",
        data=data,
        segments=segments,
        show_icons=show_icons,
        show_banners=show_banners,
        mode=mode,
        notmode=notmode,
    )


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/assets/icons'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5013)
