const CWB_API_KEY = "CWB-DF2CB80E-CB70-453A-B35E-80356742388A";

const modelUV = {
    constructor: function () {
        async function getData(url) {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        const ultraVioletData = getData("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization=" + CWB_API_KEY);
        const stationData = getData("https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0074-001?Authorization=" + CWB_API_KEY);

        Promise.all([ultraVioletData, stationData])
            .then(([ultraVioletData, stationData]) => {
                viewUV.render(ultraVioletData, stationData);
            });
    }
};


const viewUV = {
    render: function (ultraVioletData, stationData) {

        let stationList = [];
        let master = [];


        console.log(ultraVioletData)

        let stations = stationData['records']['data']['stationStatus']['station']
        for (let i = 0; i < stations.length; i++) {
            stationList.push({ 'stationID': stations[i]['StationID'], 'stationName': stations[i]['StationName'] });
        }
        console.log(stationList)

        ultraVioletValue = ultraVioletData['records']['weatherElement']['location'];
        ultraVioletValue.forEach((element) => {
            for (let j = 0; j < stationList.length; j++) {
                if (element.locationCode == stationList[j]['stationID']) {

                    master.push({ 'stationID': stationList[j]['stationID'], 'stationName': stationList[j]['stationName'], 'uvValue': element.value });
                    return
                }
            }
        });

        console.log(stationList)
        console.log(master)


        master.forEach((element) => {
            insertHtml = `<option value="` + element.stationName + `">` + element.stationName + `</option>`;
            dropdownStationName = document.querySelector("#select-station-names");
            dropdownStationName.insertAdjacentHTML("afterbegin", insertHtml);
        });

        let option = document.getElementById("select-station-names")
        option.addEventListener("change", async function () {
            stationName = this.value;

            master.forEach((e) => {
                if (e.stationName == stationName) {
                    uvValue = e.uvValue;

                    let uvIndexProgressBar = document.querySelector("#uv-index-progress-bar");
                    uvIndexProgressBar.remove();

                    let uvIndexBar = document.querySelector("#uv-index-bar");
                    insertHtml = `<progress id="uv-index-progress-bar" max="12" value="` + uvValue + `">  </progress>`
                    uvIndexBar.insertAdjacentHTML("afterbegin", insertHtml)
                    uvIndexEmoji = document.querySelector("#uv-index-emoji");

                    if (uvValue >= 0 && uvValue < 3) {
                        uvIndexEmoji.style.color = "#00F500";
                    } else if (uvValue >= 3 && uvValue < 7) {
                        uvIndexEmoji.style.color = "yellow";
                    } else if (uvValue >= 7 && uvValue < 10) {
                        uvIndexEmoji.style.color = "red";
                    } else {
                        uvIndexEmoji.style.color = "purple";

                    }
                }
            })

        });



    }
}

const controlUV = {
    constructor: function () {
        modelUV.constructor();
    }
};
controlUV.constructor();