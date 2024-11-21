// 10点签到，这里设置为9点
const signinHour = 9;
const now = new Date();
console.log("now:", now);
const currentHour = now.getHours();
const year = now.getFullYear();

// 获取存储的首页链接
const savedHomePageUrl = localStorage.getItem('homePageUrl');
if (savedHomePageUrl) {
    homePageUrl.value = savedHomePageUrl;
}

let savedManualNextWorkday;
const savedDate = localStorage.getItem('manualNextWorkday');
if (savedDate) {
    manualNextWorkdayDate.value = savedDate;
    savedManualNextWorkday = new Date(savedDate);
}

function getTargetTime(currentHour, signinHour, now) {
    if (currentHour < signinHour) {
        // 如果当前时间小于9点，当日9点刷新页面
        const targetTime = new Date();
        targetTime.setHours(signinHour, 0, 0, 0);
        return targetTime;
    }
    else if (currentHour >= signinHour + 1) {
        // 手动指定的下一个工作日
        const targetTime = getNextWorkday(now, signinHour, savedManualNextWorkday);
        return targetTime;
    }
}


// 监听开关按钮的变化并更新状态
testOpenNewTabCheckbox.addEventListener('change', () => {
    localStorage.setItem('testOpenNewTab', testOpenNewTabCheckbox.checked);
});

let targetTime = getTargetTime(currentHour, signinHour, now);
console.log("targetTime:", targetTime);
const savedTestOpenNewTab = localStorage.getItem('testOpenNewTab');
if(savedTestOpenNewTab){
    openNewWindow();
}
else{
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
    }}

    openButton.addEventListener('click', openNewWindow);

saveHomePageButton.addEventListener('click', () => {
    const homePageUrl = document.getElementById('homePageUrl').value;
    localStorage.setItem('homePageUrl', homePageUrl);
    location.reload();
});

saveButton.addEventListener('click', () => {
    const dateInput = manualNextWorkdayDate.value;
    if (dateInput) {
        localStorage.setItem('manualNextWorkday', dateInput);
        location.reload();
    }
});

clearButton.addEventListener('click', () => {
    localStorage.removeItem('manualNextWorkday');
    manualNextWorkdayDate.value = '';
    location.reload();
});

function openNewWindow() {
    const homePageUrl = localStorage.getItem('homePageUrl');
    if (homePageUrl) {
        window.open(homePageUrl, '_blank');
    }
}
