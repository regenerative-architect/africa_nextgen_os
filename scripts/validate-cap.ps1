$ErrorActionPreference = 'Stop'
$schemaSet = [System.Xml.Schema.XmlSchemaSet]::new()
[void]$schemaSet.Add('urn:oasis:names:tc:emergency:cap:1.2', (Join-Path $PSScriptRoot '..\docs\CAP-v1.2.xsd'))
$schemaSet.Compile()
$settings = [System.Xml.XmlReaderSettings]::new()
$settings.ValidationType = [System.Xml.ValidationType]::Schema
$settings.Schemas = $schemaSet
$results = @()
foreach ($fixture in Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '..\docs\cap-examples') -Filter '*.xml') {
  $issues = [System.Collections.Generic.List[string]]::new()
  $handler = [System.Xml.Schema.ValidationEventHandler] { param($sender, $eventArgs) $issues.Add($eventArgs.Message) }
  $settings.add_ValidationEventHandler($handler)
  $reader = [System.Xml.XmlReader]::Create($fixture.FullName, $settings)
  try { while ($reader.Read()) {} } finally { $reader.Close(); $settings.remove_ValidationEventHandler($handler) }
  $results += [PSCustomObject]@{file=$fixture.Name;passed=($issues.Count -eq 0);errors=@($issues)}
}
$report = [PSCustomObject]@{schema='OASIS CAP 1.2 official XSD';date='2026-10-05';fixtures=$results}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot '..\docs\cap-validation.json') -Encoding utf8
$report | ConvertTo-Json -Depth 5
if ($results.Where({ -not $_.passed }).Count -gt 0) { exit 1 }
