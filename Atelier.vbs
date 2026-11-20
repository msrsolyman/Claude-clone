Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "D:\Claude"
WshShell.Run "cmd /c ""D:\Claude\Atelier.bat""", 0, False
