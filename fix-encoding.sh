#!/bin/bash

echo "修复JavaScript文件编码问题..."
echo "=============================="

# 检查文件编码
echo "1. 检查文件编码："
file -i public/js/app.js
echo ""

# 转换为UTF-8编码
echo "2. 转换为UTF-8编码..."
iconv -f us-ascii -t utf-8 public/js/app.js -o public/js/app.js.utf8
mv public/js/app.js.utf8 public/js/app.js
echo "✅ 编码转换完成"
echo ""

# 检查转换后的编码
echo "3. 转换后编码："
file -i public/js/app.js
echo ""

# 检查关键函数
echo "4. 检查selectLocation函数："
grep -A 10 "function selectLocation" public/js/app.js
echo ""

# 修复可能的乱码字符
echo "5. 清理特殊字符..."
sed -i 's/[^[:print:]]//g' public/js/app.js
echo "✅ 特殊字符清理完成"
echo ""

# 验证文件完整性
echo "6. 文件完整性检查："
echo "   - 行数: $(wc -l < public/js/app.js)"
echo "   - 大小: $(wc -c < public/js/app.js) 字节"
echo ""

# 测试JavaScript语法
echo "7. 测试JavaScript语法..."
if node -c public/js/app.js; then
    echo "✅ JavaScript语法正确"
else
    echo "❌ JavaScript语法错误"
fi

echo ""
echo "修复完成！如果仍有乱码问题，请："
echo "1. 检查浏览器控制台是否有错误"
echo "2. 清除浏览器缓存"
echo "3. 重新加载页面"