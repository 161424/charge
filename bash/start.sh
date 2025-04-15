git pull git@gitee.com:chen_tututu/charge.git
go build -o ./charge.exe  main.go
systemctl start charge
systemctl status charge
