# Get the current directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Create the task name
$taskName = "PlaywrightTestRunner"

# Create the task action (using run-tests.bat)
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$scriptPath\run-tests.bat`"" -WorkingDirectory $scriptPath

# Create the task trigger (run daily at 9:00 AM)
$trigger = New-ScheduledTaskTrigger -Daily -At 9AM

# Create the task principal (run with SYSTEM account for server environment)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Create the task settings
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 3

# Register the task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force

Write-Host "✅ Task '$taskName' has been scheduled successfully"
Write-Host "📅 The task will run daily at 9:00 AM"
Write-Host "🔄 The task will restart up to 3 times if it fails"
Write-Host "🔑 The task will run under SYSTEM account"
Write-Host "📝 Logs will be saved in the 'logs' directory" 