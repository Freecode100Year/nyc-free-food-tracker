#!/bin/bash

echo "修复所有前端文件编码问题..."
echo "============================="

# 修复所有JavaScript文件
echo "1. 修复JavaScript文件："
for js_file in public/js/*.js; do
    if [ -f "$js_file" ]; then
        echo "  处理: $js_file"
        # 转换为UTF-8
        iconv -f us-ascii -t utf-8 "$js_file" -o "${js_file}.utf8"
        mv "${js_file}.utf8" "$js_file"
        # 清理特殊字符
        sed -i 's/[^[:print:]]//g' "$js_file"
        echo "  ✅ 完成"
    fi
done
echo ""

# 修复HTML文件
echo "2. 修复HTML文件："
for html_file in public/*.html; do
    if [ -f "$html_file" ]; then
        echo "  处理: $html_file"
        # 确保有正确的meta charset
        if ! grep -q 'charset="UTF-8"' "$html_file"; then
            sed -i 's/<meta charset="[^"]*"/<meta charset="UTF-8"/' "$html_file"
        fi
        # 清理特殊字符
        sed -i 's/[^[:print:]]//g' "$html_file"
        echo "  ✅ 完成"
    fi
done
echo ""

# 修复CSS文件
echo "3. 修复CSS文件："
for css_file in public/css/*.css; do
    if [ -f "$css_file" ]; then
        echo "  处理: $css_file"
        # 转换为UTF-8
        iconv -f us-ascii -t utf-8 "$css_file" -o "${css_file}.utf8"
        mv "${css_file}.utf8" "$css_file"
        # 清理特殊字符
        sed -i 's/[^[:print:]]//g' "$css_file"
        echo "  ✅ 完成"
    fi
done
echo ""

# 验证文件编码
echo "4. 验证文件编码："
echo "  JavaScript文件:"
file -i public/js/*.js 2>/dev/null || echo "  无JavaScript文件"
echo ""
echo "  HTML文件:"
file -i public/*.html 2>/dev/null || echo "  无HTML文件"
echo ""
echo "  CSS文件:"
file -i public/css/*.css 2>/dev/null || echo "  无CSS文件"
echo ""

# 测试网站功能
echo "5. 创建测试页面："
cat > public/test-encoding.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Encoding Test - NYC Free Food Tracker</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        .pass { background: #d4edda; color: #155724; }
        .fail { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>Encoding Test</h1>
    
    <div class="test">
        <h3>1. JavaScript Function Test</h3>
        <div id="js-test"></div>
    </div>
    
    <div class="test">
        <h3>2. Special Characters Test</h3>
        <div id="char-test"></div>
    </div>
    
    <script>
        // Test 1: Check if selectLocation function exists
        function testSelectLocation() {
            try {
                if (typeof selectLocation === 'function') {
                    document.getElementById('js-test').innerHTML = 
                        '<div class="pass">✅ selectLocation function is defined</div>';
                } else {
                    document.getElementById('js-test').innerHTML = 
                        '<div class="fail">❌ selectLocation function is not defined</div>';
                }
            } catch (e) {
                document.getElementById('js-test').innerHTML = 
                    '<div class="fail">❌ Error: ' + e.message + '</div>';
            }
        }
        
        // Test 2: Check special characters
        function testSpecialCharacters() {
            const testString = "NYC Free Food Tracker - 纽约免费食物追踪器 © 2024";
            const hasSpecialChars = /[^\x00-\x7F]/.test(testString);
            
            if (hasSpecialChars) {
                document.getElementById('char-test').innerHTML = 
                    '<div class="pass">✅ UTF-8 encoding supports special characters</div>' +
                    '<div>Test string: ' + testString + '</div>';
            } else {
                document.getElementById('char-test').innerHTML = 
                    '<div class="fail">❌ UTF-8 encoding may not be working</div>';
            }
        }
        
        // Run tests
        testSelectLocation();
        testSpecialCharacters();
    </script>
</body>
</html>
EOF
echo "  ✅ 测试页面创建完成: public/test-encoding.html"
echo ""

echo "6. 部署修复："
echo "  要应用这些修复，请运行："
echo "  git add public/"
echo "  git commit -m 'Fix file encoding issues'"
echo "  git push"
echo ""
echo "修复完成！访问以下URL测试："
echo "- 主网站: https://freecode100year.github.io/nyc-free-food-tracker/"
echo "- 编码测试: https://freecode100year.github.io/nyc-free-food-tracker/test-encoding.html"