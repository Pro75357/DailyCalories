
setlocal
@echo off
:PROMPT
SET /P AREYOUSURE=Want to make a new build (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END

set ProjectName=DailyCalories

IF not exist build (
    mkdir build
    goto BUILD
    )

cd build

IF exist %ProjectName%.tar.gz.backup (
    echo found old backup - renaming for later deletion
    ren %ProjectName%.tar.gz.backup %ProjectName%.tar.gz.backup2
    )

IF exist %ProjectName%.tar.gz (
    echo found current build- making backup 
    ren %ProjectName%.tar.gz %ProjectName%.tar.gz.backup
)

cd ../%ProjectName%

:BUILD
Echo making new build
meteor build --server-only ../build/
 
cd ../build
IF exist %ProjectName%.tar.gz (
    echo new build appears successful- deleting old backup. 
    del %ProjectName%.tar.gz.backup2
) ELSE ( 
    echo No new build found- Perhaps something went wrong? Restoring backups
    IF exist %ProjectName%.tar.tz.backup( ren %ProjectName%.tar.gz.backup %ProjectName%.tar.gz)
    IF exist %ProjectName%.tar.gz.backup2( ren %ProjectName%.tar.gz.backup2 %ProjectName%.tar.gz.backup ) )
        

:END
endlocal

cmd /k