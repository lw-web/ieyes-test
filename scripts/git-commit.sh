#!/bin/bash
# Git 提交脚本 - ieyes-test 项目
# 使用方法: ./scripts/git-commit.sh "提交说明"

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "正在检查 Git 状态..."
git status

echo ""
echo "=== 未暂存的更改 ==="
git diff

echo ""
echo "=== 未跟踪的文件 ==="
git ls-files --others --exclude-standard

echo ""
read -p "是否暂存所有更改? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add -A
    echo "已暂存所有更改"
fi

# 获取提交信息
COMMIT_MSG=""
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    echo ""
    echo "请输入提交信息 (格式: type: description):"
    read -r COMMIT_MSG
fi

# 执行提交
echo ""
echo "正在提交..."
git commit -m "$(cat <<EOF
$COMMIT_MSG

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

echo ""
echo "✓ 提交成功!"
git log -1 --oneline
git status
