const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(__dirname));

// 路由 - 首页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 光栅处理器服务器已启动！`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`🎨 您可以开始使用光栅处理器了！`);
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).send('服务器内部错误');
}); 