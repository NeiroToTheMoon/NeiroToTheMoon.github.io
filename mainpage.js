// 10点签到，这里设置为9点
const signinHour = 9;
const now = new Date();
console.log("now:", now);
const currentHour = now.getHours();
const year = now.getFullYear();

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

// 手动指定的下一个工作日
let manualNextWorkday;
const savedDate = localStorage.getItem('manualNextWorkday');
if (savedDate) {
    manualNextWorkday = new Date(savedDate);
}

// document.addEventListener('DOMContentLoaded', () => {
// const savedDate = localStorage.getItem('manualNextWorkday');
if (savedDate) {
    document.getElementById('manualNextWorkday').value = savedDate;
}
// });

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

if (currentHour < signinHour) {
    // 如果当前时间小于9点，当日9点刷新页面
    const targetTime = new Date();
    targetTime.setHours(signinHour, 0, 0, 0);
    console.log("targetTime:", targetTime);
    const delay = targetTime - now;
    setTimeout(() => {
        setDataValue("ready", false);
        location.reload();
    }, delay);
}
else if (currentHour >= signinHour + 1) {
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
    console.log("targetTime:", targetTime);
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

function openNewWindow() {
    window.open('https://sso.oa.wanmei.net/PWForms/', '_blank');
}
