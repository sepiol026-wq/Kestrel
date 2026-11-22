// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// STA is mandatory: System.Windows.Forms.Clipboard throws ThreadStateException
// off a single-threaded apartment. We emit base64 (not raw bytes) so the PNG
// survives stdout's text decoding intact, and write with [Console]::Out.Write
// to avoid a trailing newline.
const WSL_CLIPBOARD_IMAGE_SCRIPT = [
  'Add-Type -AssemblyName System.Windows.Forms,System.Drawing',
  '$img = [System.Windows.Forms.Clipboard]::GetImage()',
  'if ($null -eq $img) { exit 0 }',
  '$ms = New-Object System.IO.MemoryStream',
  '$img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)',
  '[Console]::Out.Write([System.Convert]::ToBase64String($ms.ToArray()))'
].join('\n')

export { WSL_CLIPBOARD_IMAGE_SCRIPT }
