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

// 手动维护的工作日名单
const workdays = {
    1: [26],
    2: [8],
    4: [27],
    9: [28],
    10: [11],
};

// 手动维护的休息日名单
const holidays = {
    1: [1, 28, 29, 30, 31],
    2: [1, 2, 3, 4],
    4: [4, 5, 6],
    5: [1, 2, 3, 4, 5, 31],
    6: [1, 2],
    10: [1, 2, 3, 4, 5, 6, 7, 8],
};

function isHoliday(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return holidays[month] && holidays[month].includes(day);
}

function isWorkday(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return workdays[month] && workdays[month].includes(day);
}

// 获取下一个工作日的9点
function getNextWorkday(now, signinHour, manualNextWorkday) {
    let targetTime;
    if (manualNextWorkday && manualNextWorkday > now) {
        // 如果手动指定了下一个工作日且日期大于今天，直接使用该日期
        targetTime = new Date(manualNextWorkday);
        targetTime.setHours(signinHour, 0, 0, 0);
    } else {
        // 如果没有手动指定下一个工作日，或者指定的日期小于等于今天，继续原有逻辑
        let nextDayCount = 1;
        do {
            // 获取下一天的9点
            targetTime = new Date(now.getTime() + nextDayCount * 24 * 60 * 60 * 1000);
            targetTime.setHours(signinHour, 0, 0, 0);
            if (targetTime.getFullYear() > year) {
                // 如果下一天是明年的元旦，将targetTime设置为1月2日9点
                targetTime.setDate(2);
                break;
            }
            else if (isHoliday(targetTime)) {
                // 如果下一天是休息日，继续往后推
                nextDayCount++;
            }
            else if (isWorkday(targetTime) || (targetTime.getDay() !== 0 && targetTime.getDay() !== 6)) {
                // 如果下一天是工作日，或者不是周末，跳出循环
                break;
            }
            else {
                // 如果下一天是周末，继续往后推
                nextDayCount++;
            }
        }
        while (true);
    }
    return targetTime;
}

function getTargetTime(currentHour, signinHour, now) {
    if (currentHour < signinHour) {
        // 如果当前时间小于9点，当日9点刷新页面
        const targetTime = new Date();
        targetTime.setHours(signinHour, 0, 0, 0);
        return targetTime;
    }
    else if (currentHour >= signinHour + 1) {
        // 获取下一个工作日的9点
        const targetTime = getNextWorkday(now, signinHour, savedManualNextWorkday);
        return targetTime;
    }
}