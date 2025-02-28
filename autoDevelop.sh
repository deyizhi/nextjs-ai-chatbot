
#!/bin/bash
set -e # 任何命令失败时立即退出脚本

# 参数校验
if [ $# -ne 1 ]; then
    echo "Usage: sh $0 <version>"
    exit 1
fi

VERSION=$1
DIR_NAME="queryany${VERSION}"
TAR_FILE="v${VERSION}.tar.gz"

# 下载指定版本
echo "Downloading version ${VERSION}..."
wget "https://github.com/deyizhi/nextjs-ai-chatbot/archive/refs/tags/v${VERSION}.tar.gz" -O "${TAR_FILE}"

# 创建并解压到目标目录
echo "Extracting to ${DIR_NAME}..."
mkdir -p "${DIR_NAME}"
tar -xzf "${TAR_FILE}" -C "${DIR_NAME}" --strip-components=1

# 进入项目目录
cd "${DIR_NAME}"

# 安装 Vercel CLI
echo "Installing Vercel CLI..."
npm install -g vercel

# 链接 Vercel 项目
echo "Linking Vercel project..."
vercel link

# 拉取环境变量
echo "Pulling environment variables..."
vercel env pull

echo "pnpm install pkgs..."

pnpm install

echo "pnpm install pkgs over"

# 修改NEXTAUTH_URL并备份文件
echo "Updating NEXTAUTH_URL and backing up .env.local..."
sed -i.bak "s|^NEXTAUTH_URL=\".*\"$|NEXTAUTH_URL=\"https://www.queryany.com\"|" ".env.local"

# 新增AUTH_TRUST_HOST
echo "Adding AUTH_TRUST_HOST=true..."
echo "AUTH_TRUST_HOST=true" >> ".env.local"

echo "update env file  in ${DIR_NAME}/"

echo "building..."
pnpm build
echo "build over"
# 复制并修改PM2配置文件
echo "Copying and updating PM2 configuration..."
cp "./ecosystem.config.js.template" "ecosystem${VERSION}.config.js"
sed -i "s/\${version}/${VERSION}/g" "ecosystem${VERSION}.config.js"

RUNNING_VERSION=$(pm2 list | grep online | grep -v pm2-logrotate | awk '{print $4}')


# 停止当前运行的版本
echo "Stopping version $RUNNING_VERSION..."
if ! pm2 stop "$RUNNING_VERSION"; then
    echo "Failed to stop version $RUNNING_VERSION"
    exit 1
fi

# 启动新版本
echo "Starting version $VERSION..."
if ! pm2 start ecosystem${VERSION}.config.js; then
    echo "Failed to start version $VERSION"
    pm2  restart "$RUNNING_VERSION"
    exit 1
fi


pm2 list

