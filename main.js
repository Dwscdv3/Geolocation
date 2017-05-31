window.addEventListener("load", function () {
    if ("geolocation" in navigator) {
        var map, marker, range;
        var inited = false;
        navigator.geolocation.watchPosition(function (position) {
            if (!inited) {
                inited = true;
                document.getElementById("init").hidden = true;
                map = new qq.maps.Map(document.getElementById("map"), {
                    zoom: 18
                });
                marker = new qq.maps.Marker({
                    map: map
                });
                range = new qq.maps.Circle({
                    map: map,
                    strokeWeight: 2,
                    strokeColor: new qq.maps.Color(191, 255, 159, 0.8),
                    fillColor: new qq.maps.Color(191, 255, 159, 0.5)
                });
            }
            var date = new Date(position.timestamp);
            document.getElementById("timestamp").textContent =
                date.getFullYear() + "/" +
                date.getMonth() + "/" +
                date.getDay() + " " +
                date.getHours() + ":" +
                date.getMinutes() + ":" +
                date.getSeconds();
            document.getElementById("longitude").textContent = position.coords.longitude.toFixed(6);
            document.getElementById("latitude").textContent = position.coords.latitude.toFixed(6);
            document.getElementById("accuracy").textContent = position.coords.accuracy;
            if (position.coords.altitude) {
                document.getElementById("altitude").textContent = position.coords.altitude.toFixed(6) + " ± " + position.coords.altitudeAccuracy;
            }
            if (position.coords.heading) {
                document.getElementById("heading").textContent = position.coords.heading;
            }
            if (position.coords.speed) {
                document.getElementById("speed").textContent = position.coords.speed;
            }
            qq.maps.convertor.translate(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude), 1, function (res) {
                latlng = res[0];
                marker.setPosition(latlng);
                range.setCenter(latlng);
                range.setRadius(position.coords.accuracy);
                map.panTo(latlng);
            });
        }, function (error) {
            var txtError = document.getElementById("init");
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    txtError.textContent = "您已拒绝提供位置。";
                    break;
                case error.POSITION_UNAVAILABLE:
                    txtError.textContent = "位置不可用。您的设备有定位功能吗？";
                    break;
                case error.TIMEOUT:
                    console.log("获取位置信息超时。")
                    break;
                default:
                    txtError.textContent = "发生了未知错误。";
                    break;
            }
        }, {
            enableHighAccuracy: true,
            maximumAge: 0
        });
    } else {
        document.getElementById("init").textContent = "您的浏览器不支持定位。";
    }
});