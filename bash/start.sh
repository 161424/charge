git pull git@gitee.com:chen_tututu/charge.git master
cd ..
echo pwd
go build -o ./charge.exe  main.go
systemctl stop charge
systemctl start charge
systemctl status charge
