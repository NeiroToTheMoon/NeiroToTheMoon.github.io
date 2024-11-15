// 获取 qrcode 并打开新标签页
fetchData(data => {
    const qrtime = data.time;
    console.log('data:', data);
    const lastRequestDate = new Date(data.time);
    tipText.textContent = lastRequestDate.toLocaleString() + ",获取成功:";
    const qrcodeValue = data.qrcode;
    if (qrcodeValue) {
        newUrl = `https://api.cl2wm.cn/api/qrcode/code?text=${qrcodeValue}`;
        window.open(newUrl, '_blank');
    } else {
        console.error('No qrcode value found in the response.');
    }
});

// 点击 SignIn 按钮时跳转到 signin.html
jumpButton.addEventListener('click', () => {
    window.location.href = newUrl;
});



