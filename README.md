# Radview Webload and headless Chrome using Selenium
How-To configure Chrome webbrowser in headless-mode within Radview Webload using Selenium.



## Related file
When installed using default settings, you can find selenium.js in: 
C:\Program Files (x86)\RadView\WebLOAD\include\selenium.js

```diff
16a17,22
>       case "ChromeHeadless":
>         options = new Packages.org.openqa.selenium.chrome.ChromeOptions();
>         var opt = ["headless","disable-gpu"];
>         options.addArguments(opt);
>         driver  = new Packages.org.openqa.selenium.chrome.ChromeDriver( options );
>         break;
```
