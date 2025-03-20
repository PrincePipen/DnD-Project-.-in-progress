@echo off
echo Connecting to MySQL...

REM Try to find MySQL command-line client (part of XAMPP)
SET MYSQL_PATH="%XAMPP_HOME%\mysql\bin\mysql.exe"
IF NOT EXIST %MYSQL_PATH% (
    SET MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
)

IF EXIST %MYSQL_PATH% (
    %MYSQL_PATH% -u root -p ai_dnd_game
) ELSE (
    echo MySQL client not found.
    echo Make sure XAMPP is installed and MySQL is running.
    echo You can also connect using phpMyAdmin at http://localhost/phpmyadmin/
)

pause
