// 10点签到，这里设置为9点
const signinHour = 9;
const now = new Date();
console.log("now:", now);
const currentHour = now.getHours();
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
} else if (currentHour >= signinHour + 1) {
    // 如果当前时间大于10点，下一个工作日9点刷新页面
    let nextDayCount;
    if (now.getDay() === 5) {
        // 如果今天是周五，加三天到周一
        nextDayCount = 3;
    } else if (now.getDay() === 6) {
        // 如果今天是周六，加两天到周一
        nextDayCount = 2;
    } else {
        // 否则加一天到明天
        nextDayCount = 1;
    }
    const targetTime = new Date(now.getTime() + nextDayCount * 24 * 60 * 60 * 1000);
    targetTime.setHours(signinHour, 0, 0, 0);
    console.log("targetTime:", targetTime);
    const delay = targetTime - now;
    setTimeout(() => {
        setDataValue("ready", false);
        location.reload();
    }, delay);
} else {
    // 如果当前时间在9-10点之间
    console.log("fetch ready");
    fetchDataValue("ready", (value) => {
        console.log("ready:", value);
        if (value) {
            openNewWindow();
        }
        else{
            // 每隔一分钟刷新一次页面
            setTimeout(() => {
                location.reload();
            }, 60000);
        }
    });
}

document.getElementById('openButton').addEventListener('click', openNewWindow);

function openNewWindow() {
    window.open('https://sso.oa.wanmei.net/PWForms/', '_blank');
}
