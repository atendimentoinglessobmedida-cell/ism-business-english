# Run with PowerShell 7; the Portuguese companion uses Windows PowerShell/WinRT.
param([Parameter(Mandatory=$true)][string]$Jobs,[Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$voice=[System.Speech.Synthesis.SpeechSynthesizer]::new()
$installed=$voice.GetInstalledVoices() | Where-Object {$_.Enabled -and $_.VoiceInfo.Name -eq 'Microsoft Zira Desktop'} | Select-Object -First 1
if(!$installed){throw 'Microsoft Zira Desktop must be installed.'}
$voice.SelectVoice($installed.VoiceInfo.Name)
[IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null
$items=@(Get-Content -LiteralPath $Jobs -Raw -Encoding UTF8 | ConvertFrom-Json | Where-Object {$_.lang -eq 'en-US'})
$count=0
try{
 foreach($job in $items){
  $file=Join-Path $OutputDirectory ($job.key+'.wav')
  if(!(Test-Path -LiteralPath $file)){
   $text=[Security.SecurityElement]::Escape([string]$job.text)
   $rate=([int]$job.rate-100).ToString()+'%'
   $pitch=([int]$job.pitch).ToString()+'st'
   $ssml='<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="'+$rate+'" pitch="'+$pitch+'">'+$text+'</prosody></speak>'
   $voice.SetOutputToWaveFile($file)
   try{$voice.SpeakSsml($ssml)}finally{$voice.SetOutputToNull()}
  }
  $count++
  if($count % 30 -eq 0){Write-Output ('English segments '+$count+'/'+$items.Count)}
 }
}finally{$voice.Dispose()}
Write-Output ('Completed '+$count+' English segments')
