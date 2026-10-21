param([Parameter(Mandatory=$true)][string]$Jobs,[Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$winVoiceType=[Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$streamType=[Windows.Media.SpeechSynthesis.SpeechSynthesisStream,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$asTask=([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'})[0]
$pt=[Windows.Media.SpeechSynthesis.SpeechSynthesizer]::new()
$portuguese=$winVoiceType::AllVoices | Where-Object {$_.Language -eq 'pt-BR' -and $_.DisplayName -eq 'Microsoft Maria'} | Select-Object -First 1
if(!$portuguese){throw 'The configured Portuguese voice is not installed.'}
$pt.Voice=$portuguese
[IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null
$allJobs=ConvertFrom-Json -InputObject (Get-Content -LiteralPath $Jobs -Raw -Encoding UTF8)
$items=@($allJobs | Where-Object {$_.lang -eq 'pt-BR'})
$count=0
try{
 foreach($job in $items){
  $file=Join-Path $OutputDirectory ($job.key+'.wav')
  if(!(Test-Path -LiteralPath $file)){
   if($job.lang -eq 'pt-BR'){
    $pt.Options.SpeakingRate=[double]$job.rate/100
    $task=$asTask.MakeGenericMethod($streamType).Invoke($null,@($pt.SynthesizeTextToStreamAsync([string]$job.text)))
    $stream=$task.GetAwaiter().GetResult()
    $input=[System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
    $output=[IO.File]::Create($file)
    try{$input.CopyTo($output)}finally{$output.Dispose();$input.Dispose();$stream.Dispose()}
   }else{throw 'Unsupported script language.'}
  }
  $count++
  if($count % 20 -eq 0){Write-Output ('Rendered '+$count+'/'+$items.Count+' segments')}
 }
}finally{$pt.Dispose()}
Write-Output ('Completed '+$count+' segments using '+$portuguese.DisplayName)
