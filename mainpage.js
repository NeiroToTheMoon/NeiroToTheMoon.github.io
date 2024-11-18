// 10点签到，这里设置为9点
const signinHour = 9;
const now = new Date();
console.log("now:", now);
const currentHour = now.getHours();
const year = now.getFullYear();

// 手动指定的下一个工作日
let manualNextWorkday;
const savedDate = localStorage.getItem('manualNextWorkday');
if (savedDate) {
    manualNextWorkday = new Date(savedDate);
}

// document.addEventListener('DOMContentLoaded', () => {
if (savedDate) {
    document.getElementById('manualNextWorkday').value = savedDate;
}
// });

function getTargetTime(currentHour, signinHour, now, manualNextWorkday) {
    if (currentHour < signinHour) {
        // 如果当前时间小于9点，当日9点刷新页面
        const targetTime = new Date();
        targetTime.setHours(signinHour, 0, 0, 0);
        return targetTime;
    }
    else if (currentHour >= signinHour + 1) {
        const targetTime = getNextWorkday(now, signinHour, manualNextWorkday);
        return targetTime;
    }
}

let targetTime = getTargetTime(currentHour, signinHour, now, manualNextWorkday);
console.log("targetTime:", targetTime);
if (targetTime) {
    const delay = targetTime - now;
    setTimeout(() => {
        setDataValue("ready", false);
        location.reload();
    }, delay);
}
else {
    // 如果当前时间在9-10点之间
    console.log("fetch ready");
    fetchDataValue("ready", (value) => {
        console.log("ready:", value);
        if (value) {
            openNewWindow();
        }
        else {
            // 每隔一分钟刷新一次页面
            setTimeout(() => {
                location.reload();
            }, 60000);
        }
    });
}

document.getElementById('openButton').addEventListener('click', openNewWindow);

document.getElementById('saveButton').addEventListener('click', () => {
    const dateInput = document.getElementById('manualNextWorkday').value;
    if (dateInput) {
        localStorage.setItem('manualNextWorkday', dateInput);
        location.reload();
    }
});

document.getElementById('clearButton').addEventListener('click', () => {
    localStorage.removeItem('manualNextWorkday');
    document.getElementById('manualNextWorkday').value = '';
    location.reload();
});

function openNewWindow() {
    window.open('https://sso.oa.wanmei.net/PWForms/', '_blank');
}
