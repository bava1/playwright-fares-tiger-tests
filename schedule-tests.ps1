# Get the current directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Create the task name
$taskName = "PlaywrightTestRunner"

# Create the task action
$action = New-ScheduledTaskAction -Execute "node.exe" -Argument "run-tests.ts" -WorkingDirectory $scriptPath

# Create the task trigger (run daily at 9:00 AM)
$trigger = New-ScheduledTaskTrigger -Daily -At 9AM

# Create the task principal (run with highest privileges)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Highest

# Create the task settings
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 3

# Register the task
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force

Write-Host "✅ Task '$taskName' has been scheduled successfully"
Write-Host "📅 The task will run daily at 9:00 AM"
Write-Host "🔄 The task will restart up to 3 times if it fails"
Write-Host "🔑 The task will run with highest privileges" 