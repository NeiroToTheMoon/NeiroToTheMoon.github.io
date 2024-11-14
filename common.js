function getSecret() {
    return localStorage.getItem('secret');
}

function getDataUrl() {
    return `https://store.zapier.com/api/records?secret=${getSecret()}`;
}

function setDataValue(newValue, key, toggleText) {
    if (toggleText) {
        toggleText.textContent = "设置中...请等待，请勿刷新页面";
    }

    fetch(getDataUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [newValue]: key })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (toggleText) {
                toggleText.textContent = "设置成功";
            }
            return response.json();
        })
        .then(data => {
            if (toggleText) {
                toggleText.textContent = "设置成功";
            }
            console.log(`${key} state updated successfully:`, data);
        })
        .catch(error => {
            if (toggleText) {
                toggleText.textContent = "设置失败";
            }
            console.error(`Failed to update ${key} state:`, error.message);
        });
}

function fetchData(callback) {
    fetch(getDataUrl())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Failed to fetch data:', error.message);
        });
}

function fetchDataValue(key, callback){
    fetchData(data => {
        callback(data[key]);
    });
}