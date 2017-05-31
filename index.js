window.addEventListener("load", function () {
    var qs = getUrlVars();
    if (qs["id"] != null && qs["id"].length > 0) {
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
                document.getElementById("longitude").textContent = position.coords.longitude.toFixed(7);
                document.getElementById("latitude").textContent = position.coords.latitude.toFixed(7);
                document.getElementById("accuracy").textContent = position.coords.accuracy;
                qq.maps.convertor.translate(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude), 1, function (res) {
                    latlng = res[0];
                    marker.setPosition(latlng);
                    range.setCenter(latlng);
                    range.setRadius(position.coords.accuracy);
                    map.panTo(latlng);
                });
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "put.php");
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(
                    "id=" + qs["id"] +
                    "&time=" + position.timestamp.toString() +
                    "&lng=" + position.coords.longitude.toFixed(7) +
                    "&lat=" + position.coords.latitude.toFixed(7) +
                    "&range=" + position.coords.accuracy.toString()
                );
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
    } else {
        document.getElementById("init").textContent = "地址中缺少 'id'。";
    }
});

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}