window.addEventListener("load", function () {
    var txtError = document.getElementById("init");
    var qs = getUrlVars();
    if (qs["id"] != null && qs["id"].length > 0) {
        document.title = "正在查看 " + qs["id"] + " 的位置";
        var map, marker, range;
        var inited = false;
        var loop = setInterval(refresh, 30000);
        refresh();
    } else {
        txtError.textContent = "地址中缺少 'id'。";
    }

    function refresh() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var data = JSON.parse(xhr.responseText);
                if (data.error) {
                    txtError.textContent = data.msg;
                    clearInterval(loop);
                } else {
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
                    var date = new Date(parseInt(data.time));
                    document.getElementById("timestamp").textContent =
                        date.getFullYear() + "/" +
                        date.getMonth() + "/" +
                        date.getDay() + " " +
                        date.getHours() + ":" +
                        date.getMinutes() + ":" +
                        date.getSeconds();
                    document.getElementById("longitude").textContent = data.lng;
                    document.getElementById("latitude").textContent = data.lat;
                    document.getElementById("accuracy").textContent = data.range;
                    qq.maps.convertor.translate(new qq.maps.LatLng(data.lat, data.lng), 1, function (res) {
                        latlng = res[0];
                        marker.setPosition(latlng);
                        range.setCenter(latlng);
                        range.setRadius(parseInt(data.range));
                        map.panTo(latlng);
                    });
                }
            }
        };
        xhr.open("GET", "get.php?id=" + qs["id"]);
        xhr.send();
    }
});


function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}