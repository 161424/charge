git pull git@gitee.com:chen_tututu/charge.git master
cd ..
go build -o ./charge.exe  main.go
systemctl start charge
systemctl status charge
