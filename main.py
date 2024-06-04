import requests
import os
import base64

from flask import Flask, render_template, request, send_from_directory

app = Flask(__name__)
app.url_map.strict_slashes = False
carterapi_baseurl = "http://127.0.0.1:5000/"

HEADERS = {
        'x-api-key': "i0l765RJ30f9HR47L072c2tc74V1597h",
        'Content-Type': 'application/json'
    }


@app.route("/")
def index():
    mode = request.args.get("mode")
    if not mode:
        mode = "dark"

    # Data to send in the request body
    request_data = {
    }

    try:
        response = requests.post(f"{carterapi_baseurl}/get/portfolio-config", headers=HEADERS, json=request_data)
    except requests.exceptions.ConnectionError as e:
        return "API inaccessible. Please try again later.<br><br>" + str(e)
    else:
        try:
            data = response.json()["data"]

            data["colours"] = data["colours"][mode]

            favicon_data = base64.b64decode(data["favicon"])

            with open("static/assets/icons/favicon.ico", 'wb') as ico_file:
                ico_file.write(favicon_data)

            segments = {}

            for segment_id in data["segments"]:
                request_data = {
                    "id": segment_id
                }
                response = requests.post(f"{carterapi_baseurl}/get/portfolio-segment", headers=HEADERS, json=request_data)
                segment_data = response.json()["data"]
                segment_name = segment_data["name"]
                segment_data.pop("name")
                segments.update({segment_name: segment_data})
        except KeyError as e:
            return "API response error. Please try again later.<br><br>" + str(response.json())

        show_icons = True
        show_banners = True

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
