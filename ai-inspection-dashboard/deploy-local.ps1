# ��������ʱ��ֹ
$ErrorActionPreference = "Stop"

# ����
npm run build

# ���빹���ļ���
cd dist

# ����.nojekyll�ļ�����ֹGitHub Pages�����»��߿�ͷ���ļ���
New-Item -Path ".nojekyll" -ItemType "file" -Force

# ��ʾ������Ϣ
Write-Host "-------------------------------------------------"
Write-Host "������ɣ�������ͨ�����·�ʽ����:" -ForegroundColor Green
Write-Host "1. �ֶ��ϴ� dist �ļ������ݵ� GitHub �ֿ�" -ForegroundColor Cyan
Write-Host "2. ����ʹ������: git push -f <���Ĳֿ�URL> master:gh-pages" -ForegroundColor Cyan
Write-Host "-------------------------------------------------"

# �����ϲ�Ŀ¼
cd ..
