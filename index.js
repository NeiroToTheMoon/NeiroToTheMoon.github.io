// 初始化开关状态（获取值之前隐藏开关）
fetchData(data => {
    // 获取到值后显示开关
    const enabledValue = data.enabled;
    toggleSwitch.checked = enabledValue === true;
    toggleLabel.style.display = 'inline';
    const readyValue = data.ready;
    readyToggleSwitch.checked = readyValue === true;
    readyToggleLabel.style.display = 'inline';
    // data.time转成date
    const lastRequestDate = new Date(data.time);
    lastRequestTimeText.textContent = "上次获取二维码时间:" + lastRequestDate.toLocaleString();
    const lastOpenTime = new Date(data.lastOpenTime);
    lastOpenTimeText.textContent = "上次打开页面时间:" + lastOpenTime.toLocaleString();
});

// 监听开关按钮的变化并更新状态
toggleSwitch.addEventListener('change', () => {
    setDataValue('enabled', toggleSwitch.checked, toggleText);
});

// 监听开关按钮的变化并更新状态
readyToggleSwitch.addEventListener('change', () => {
    setDataValue('ready', readyToggleSwitch.checked, toggleText);
});

// 点击 SignIn 按钮时跳转到 signin.html
signInButton.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const savedSecret = localStorage.getItem('secret');
    if (savedSecret) {
        secretInput.value = savedSecret;
    }
});

saveSecretButton.addEventListener('click', () => {
    const secretValue = secretInput.value;
    localStorage.setItem('secret', secretValue);
    alert('Secret saved!');
});

openLinkButton.addEventListener('click', () => {
    const secretValue = secretInput.value;
    const url = `https://store.zapier.com/api/records?secret=${secretValue}`;
    window.open(url, '_blank');
});

refreshButton.addEventListener('click', () => {
    location.reload();
});
