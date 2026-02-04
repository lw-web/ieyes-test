# Git 提交规范

本项目遵循规范的 Git 提交流程和约定。

## 提交类型 (type)

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | feat: 添加用户登录功能 |
| `fix` | 修复 Bug | fix: 修复登录接口报错 |
| `docs` | 文档变更 | docs: 更新 README |
| `style` | 代码格式调整 | style: 统一缩进格式 |
| `refactor` | 重构代码 | refactor: 优化 request 封装 |
| `test` | 测试相关 | test: 添加单元测试 |
| `chore` | 构建/工具链变更 | chore: 升级依赖版本 |

## 标准提交流程

### 1. 查看当前状态
```bash
git status
git diff
```

### 2. 暂存文件
```bash
# 暂存特定文件
git add file1.ts file2.ts

# 暂存所有修改
git add -A
```

### 3. 提交更改
```bash
git commit -m "$(cat <<'EOF'
feat: 添加 XXX 功能

- 详细变更点 1
- 详细变更点 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 4. 验证提交
```bash
git status
git log -1 --oneline
```

## 快捷脚本

使用项目中的提交脚本：
```bash
./scripts/git-commit.sh "feat: 添加新功能"
```

## 提交模板

```bash
git commit -m "$(cat <<'EOF'
<type>: <简短描述>

<详细描述（可选）>

- 变更点 1
- 变更点 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

## 本项目历史提交

```
60fa855 feat: 添加 API 请求封装和示例页面
210a6ac feat: 添加 UmiJS Model 数据流计数器 Demo
4533b9f 初始化
```
